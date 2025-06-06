// server.js - Backend API for Moodle Integration
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const OpenAI = require('openai');

const app = express();
app.use(cors());
app.use(express.json());

// Configuration
const MOODLE_URL = process.env.MOODLE_URL; // Your Moodle instance URL
const MOODLE_TOKEN = process.env.MOODLE_TOKEN; // Your Moodle API token
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

// Moodle API Helper Functions
class MoodleAPI {
  static async makeRequest(wsfunction, parameters = {}) {
    try {
      const response = await axios.post(`${MOODLE_URL}/webservice/rest/server.php`, null, {
        params: {
          wstoken: MOODLE_TOKEN,
          wsfunction: wsfunction,
          moodlewsrestformat: 'json',
          ...parameters
        }
      });
      return response.data;
    } catch (error) {
      console.error('Moodle API Error:', error);
      throw error;
    }
  }

  // Get user's enrolled courses
  static async getUserCourses(userid) {
    return await this.makeRequest('core_enrol_get_users_courses', { userid });
  }

  // Get course details
  static async getCourseDetails(courseid) {
    const courses = await this.makeRequest('core_course_get_courses', { 
      'options[ids][0]': courseid 
    });
    return courses[0];
  }

  // Get SCORM activities in a course
  static async getSCORMActivities(courseid) {
    return await this.makeRequest('mod_scorm_get_scorms_by_courses', {
      'courseids[0]': courseid
    });
  }

  // Get user progress/grades
  static async getUserGrades(courseid, userid) {
    return await this.makeRequest('core_grades_get_grades', {
      courseid: courseid,
      userid: userid
    });
  }

  // Get course modules (activities)
  static async getCourseModules(courseid) {
    return await this.makeRequest('core_course_get_course_module', {
      courseid: courseid
    });
  }

  // Check user enrollment status
  static async checkEnrollment(userid, courseid) {
    const courses = await this.getUserCourses(userid);
    return courses.some(course => course.id === courseid);
  }
}

// Subscription Management (EdQueries.com integration)
class SubscriptionManager {
  static async checkSubscription(userid, subject) {
    // Replace with your actual EdQueries.com API integration
    // This is a mock implementation
    try {
      const response = await axios.get(`https://edqueries.com/api/subscription/${userid}`);
      const subscriptions = response.data.subscriptions || [];
      
      return {
        hasAccess: subscriptions.includes(subject.toLowerCase()),
        subscriptions: subscriptions,
        purchaseUrl: `https://edqueries.com/subscribe/${subject}`
      };
    } catch (error) {
      console.error('Subscription check error:', error);
      return { hasAccess: false, subscriptions: [], purchaseUrl: null };
    }
  }
}

// AI Processing Functions
class AIProcessor {
  static async processUserQuery(query, userContext) {
    const systemPrompt = `
    You are an AI Education Assistant integrated with a Moodle LMS. 
    
    User Context:
    - User ID: ${userContext.userid}
    - Enrolled Courses: ${JSON.stringify(userContext.courses)}
    - Subscriptions: ${JSON.stringify(userContext.subscriptions)}
    - Recent Progress: ${JSON.stringify(userContext.progress)}
    
    Your capabilities:
    1. Course Discovery: Recommend courses based on user needs
    2. Subscription Management: Check access and suggest purchases
    3. Competency Tracking: Analyze progress and suggest next steps
    4. Learning Plan Generation: Create personalized study plans
    
    Provide helpful, personalized responses with direct links to Moodle courses when appropriate.
    `;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: query }
        ],
        temperature: 0.7
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw error;
    }
  }

  static async generateLearningPlan(userProgress, targetCompetencies) {
    const prompt = `
    Based on the user's current progress and target competencies, create a personalized learning plan.
    
    Current Progress: ${JSON.stringify(userProgress)}
    Target Competencies: ${JSON.stringify(targetCompetencies)}
    
    Generate a structured learning plan with:
    1. Learning objectives
    2. Recommended courses/activities
    3. Timeline
    4. Assessment milestones
    `;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('Learning plan generation error:', error);
      throw error;
    }
  }
}

// API Routes

// Main chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, userid } = req.body;

    // Get user context from Moodle
    const userCourses = await MoodleAPI.getUserCourses(userid);
    const subscriptions = await SubscriptionManager.checkSubscription(userid, 'all');
    
    // Get recent progress
    const progress = [];
    for (const course of userCourses.slice(0, 3)) { // Last 3 courses
      const grades = await MoodleAPI.getUserGrades(course.id, userid);
      progress.push({ course: course.fullname, grades });
    }

    const userContext = {
      userid,
      courses: userCourses,
      subscriptions: subscriptions.subscriptions,
      progress
    };

    // Process with AI
    const aiResponse = await AIProcessor.processUserQuery(message, userContext);

    // Enhance response with Moodle links
    const enhancedResponse = await enhanceWithMoodleLinks(aiResponse, userCourses);

    res.json({
      response: enhancedResponse,
      userContext,
      moodleLinks: generateMoodleLinks(userCourses)
    });

  } catch (error) {
    console.error('Chat API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Course discovery endpoint
app.get('/api/courses/:userid', async (req, res) => {
  try {
    const { userid } = req.params;
    const courses = await MoodleAPI.getUserCourses(userid);
    
    const coursesWithDetails = await Promise.all(
      courses.map(async (course) => {
        const details = await MoodleAPI.getCourseDetails(course.id);
        const scormActivities = await MoodleAPI.getSCORMActivities(course.id);
        return { ...course, details, scormActivities };
      })
    );

    res.json(coursesWithDetails);
  } catch (error) {
    console.error('Course discovery error:', error);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

// Subscription check endpoint
app.get('/api/subscription/:userid/:subject', async (req, res) => {
  try {
    const { userid, subject } = req.params;
    const subscription = await SubscriptionManager.checkSubscription(userid, subject);
    res.json(subscription);
  } catch (error) {
    console.error('Subscription check error:', error);
    res.status(500).json({ error: 'Failed to check subscription' });
  }
});

// Learning plan generation endpoint
app.post('/api/learning-plan', async (req, res) => {
  try {
    const { userid, targetCompetencies } = req.body;
    
    // Get user progress
    const courses = await MoodleAPI.getUserCourses(userid);
    const progress = [];
    
    for (const course of courses) {
      const grades = await MoodleAPI.getUserGrades(course.id, userid);
      progress.push({ course: course.fullname, grades });
    }

    const learningPlan = await AIProcessor.generateLearningPlan(progress, targetCompetencies);
    
    res.json({ learningPlan, progress });
  } catch (error) {
    console.error('Learning plan error:', error);
    res.status(500).json({ error: 'Failed to generate learning plan' });
  }
});

// Helper functions
function enhanceWithMoodleLinks(response, courses) {
  // Add direct Moodle course links to AI response
  let enhanced = response;
  
  courses.forEach(course => {
    const courseLink = `${MOODLE_URL}/course/view.php?id=${course.id}`;
    if (enhanced.toLowerCase().includes(course.fullname.toLowerCase())) {
      enhanced = enhanced.replace(
        new RegExp(course.fullname, 'gi'),
        `[${course.fullname}](${courseLink})`
      );
    }
  });
  
  return enhanced;
}

function generateMoodleLinks(courses) {
  return courses.map(course => ({
    name: course.fullname,
    url: `${MOODLE_URL}/course/view.php?id=${course.id}`,
    id: course.id
  }));
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;