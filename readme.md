# 🦄 Wild Rydes: Serverless Web Application on AWS

A fully functional fleet management system for requesting unicorn rides. Built using a modern serverless architecture on AWS.

## 🏗 Architecture
- **Frontend:** AWS Amplify (Static Hosting + CI/CD)
- **Auth:** Amazon Cognito (User Identity)
- **API:** Amazon API Gateway (RESTful Endpoints)
- **Logic:** AWS Lambda (Node.js)
- **Database:** Amazon DynamoDB (NoSQL)
- **Maps:** ArcGIS API

---

## 🛠 Project Phases (Branching Strategy)

### 1. `feature/static-site`
* **Goal:** Host the HTML/CSS/JS assets.
* **Action:** Connect this branch to **AWS Amplify** for automatic deployment.
* **Key Files:** `frontend/index.html`, `frontend/ride.html`.

### 2. `feature/cognito-auth`
* **Goal:** Secure the app with JWT tokens.
* **Action:** Update `frontend/js/config.js` with your **UserPoolId** and **ClientId**.
* **Config Snippet:**
    ```javascript
    window._config = {
        cognito: {
            userPoolId: 'us-east-1_xxxxx',
            userPoolClientId: 'xxxxxxxx',
            region: 'us-east-1'
        }
    };
    ```

### 3. `feature/serverless-backend`
* **Goal:** Process ride requests and store data.
* **Action:** Deploy the Lambda function located in `backend/lambda/` and link to API Gateway.
* **Database:** DynamoDB Table name `Rides` with Partition Key `RideId`.

---

## 🚀 CI/CD with GitHub Actions
This project uses GitHub Actions to validate code and prepare deployments. 
- Pushes to `main` trigger the production build.
- Feature branches run linting and security checks.

## 🧹 Cleanup
To avoid charges, delete the Amplify App, Cognito User Pool, and DynamoDB table after testing.
