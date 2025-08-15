# AI Image Generator (React + AWS Bedrock)

A minimal full-stack template to generate images via **AWS Bedrock Runtime** using a React frontend (Vite) and an Express proxy server.

## Architecture

```
React (Vite)  --->  Express proxy (/api)  --->  AWS Bedrock Runtime (e.g., Stability SDXL)
```

Direct calls from the browser to Bedrock are **not recommended** (you'd expose secrets). The Node server signs requests with your AWS credentials and forwards to Bedrock.

## Prereqs

- Node 18+
- An AWS account with access to Bedrock (enable the Stability models in the console)
- AWS credentials (Access key / secret or a profile; in production use IAM roles)
- (Optional) AWS CLI configured

## Local Development

1. **Server**
   ```bash
   cd server
   cp .env.example .env
   # Fill in AWS_REGION and credentials (for local dev only)
   npm install
   npm run dev
   ```

2. **Frontend**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

   Open http://localhost:5173. The dev server proxies `/api` to the Node server at `http://localhost:3001`.

## Deploying the Proxy to AWS

For production, use **API Gateway + Lambda** with IAM roles instead of long-lived keys.
- Convert `server/index.js` into a Lambda handler (use `aws-serverless-express` or rewrite as native Lambda + Bedrock SDK).
- Put API Gateway in front and update the frontend proxy/URL accordingly.

## GitHub Instructions

```bash
# From the project root
git init
git add .
git commit -m "feat: initial AI image generator (React + Bedrock)"
git branch -M main
git remote add origin https://github.com/<your-username>/ai-image-gen-app.git
git push -u origin main
```

## Notes

- Some Bedrock models return different shapes. This template expects Stability's `{ artifacts: [{ base64 }] }`.
- Make sure the model you choose is **enabled** in your region and account.
- Never commit real credentials. Use `.env` for local only and set environment variables in your deployment platform.
