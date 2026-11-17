# crumb-kettle-cafe-shop
This repo contains a src code to deploy a simple cafe web application.

## A static site (HTML/CSS/JS) deployed on AWS using S3, CloudFront, Origin Access Control, AWS WAF, and a GoDaddy-registered domain with an AWS Certificate Manager (ACM) TLS certificate.

🔹 Amazon S3 – Used to store the static website files such as HTML, CSS, JavaScript, and other assets.
🔹 Amazon CloudFront – Configured as the Content Delivery Network (CDN) to serve the website through AWS edge locations.
🔹 Origin Access Control (OAC) – Configured so that CloudFront can securely access the S3 bucket while keeping direct public access to the bucket blocked.
🔹 Amazon Route 53 – Used for DNS configuration and routing the custom domain to the CloudFront distribution.
🔹 AWS Certificate Manager (ACM) – Used to provision an SSL/TLS certificate and enable secure HTTPS access.
🔹 AWS WAF – Added at the CloudFront layer to provide protection against common web vulnerabilities.

🔄 Architecture Flow
User → Route 53 → CloudFront → S3


```
Browser
   │  HTTPS
   ▼
GoDaddy DNS (CNAME records)
   │
   ▼
CloudFront Distribution  ── WAF (managed rules) attached
   │  (Origin Access Control — signed requests only)
   ▼
S3 Bucket (private, no public access)
```
