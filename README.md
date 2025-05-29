# E5 Modern Entreprise Software Engenering

# 🚀 CI/CD Nerfées – Terraform AWS Infrastructure Deployment

This project automates the provisioning of AWS infrastructure using **Terraform**, securely deployed through **GitHub Actions** using **OIDC (OpenID Connect)** and smart resource handling. Built with scalability, security, and CI/CD best practices in mind.

---

## 🔧 Stack Overview

| Layer             | Technology                                            |
| ----------------- | ----------------------------------------------------- |
| Infrastructure    | [Terraform](https://www.terraform.io/)                |
| Cloud Provider    | [AWS](https://aws.amazon.com/)                        |
| CI/CD             | [GitHub Actions](https://github.com/features/actions) |
| AWS Auth          | GitHub OIDC + IAM Role                                |
| Deployment Target | EC2                                                   |
| Key Management    | SSH Key from GitHub Secret                            |

---

## 📁 Project Structure

```
.
├── .env*                            # 🔒 Environment config (dynamic, gitignored)
├── .github/workflows/             # GitHub Actions pipeline
│   ├── cd.yml                     # Continuous deployment for main updates
│   ├── ci.yml                     # Continuous integration for dev updates
│   ├── infra.yml                  # Terraform infrastructure config for AWS
│   └── version.yml                # Tag-based versioning
│
├── routes/
│   └── tasks.js                   # API route handlers
│
├── terraform/
│   ├── main.tf                    # Terraform resources
│   ├── variables.tf               # Variable definitions
│   ├── vars.tfvars                # 🔒 Dynamic vars file (gitignored)
│   └── deployer-key.pub           # 🔒 SSH public key (from secret)
│
├── tests/
│   └── task.test.js               # Jest test suite
│
├── app.js                         # API entry point
│
├── Dockerfile                     # Containerization setup
│
├── other project settings
└── tasks.json                     # JSON database for tasks
```

> **\*** Files like `.env` and `vars.tfvars` are generated dynamically and should not be committed.

---

## 🔐 DotEnv, GitHub Secrets & Variables


### ⚙️ Environment Configuration: `.env`

The `.env` file is **dynamically created** during CI/CD deployment and is used to inject runtime environment variables such as ports and deployment environments.

### Example contents (production):

```
PORT=80
ENV=production
```

### Example contents (development):

```
PORT=3000
ENV=development
```

### Where it's used:
- Injected into the Docker container via `--env-file .env`.
- Generated in GitHub Actions based on branch context (`main` vs others).
- Copied securely to the EC2 instance before running the container.

### Local usage:

```bash
cp .env.example .env
# Edit as needed
npm start
```

> 🔒 Ensure `.env` is **listed in `.gitignore`** to avoid committing sensitive data.

### 🔑 Secrets

| Name          | Description                        |
| ------------- | ---------------------------------- |
| `EC2_SSH_KEY` | Public SSH key used for EC2 access |
| `EC2_HOST`    | EC2 host ip adress                 |


### 📦 Variables

| Name           | Example Value                                     |
| -------------- | ------------------------------------------------- |
| `AWS_REGION`   | `eu-west-3`                                       |
| `AWS_ROLE_ARN` | `arn:aws:iam::123456789012:role/GitHubDeployRole` |

---

## 🔁 GitHub Actions Workflow Overview

Workflow: `.github/workflows/infra.yml`

### Triggered on:

* Manual dispatch (`workflow_dispatch`)
* Push to `main` (if affecting `terraform/` or the workflow)

### Pipeline Steps:

1. **Checkout**: Retrieves the source code.
2. **OIDC Auth**: Assumes the AWS IAM role using GitHub's OIDC.
3. **SSH Key Setup**: Creates the public key file for EC2.
4. **Dynamic vars.tfvars**: Generates the dynamic variable file with the SSH key path.
5. **Terraform Init**: Initializes the backend and providers.
6. **Smart Imports**: Automatically imports existing AWS resources:

   * EC2 Key Pair
   * Security Group
7. **Terraform Plan**: Shows the proposed changes.
8. **Terraform Apply**: Provisions or updates resources (main branch only).

---

## 🔐 OIDC AWS Integration

### IAM Trust Policy Example

```json
{
  "Effect": "Allow",
  "Principal": {
    "Federated": "arn:aws:iam::<ACCOUNT_ID>:oidc-provider/token.actions.githubusercontent.com"
  },
  "Action": "sts:AssumeRoleWithWebIdentity",
  "Condition": {
    "StringEquals": {
      "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
    },
    "StringLike": {
      "token.actions.githubusercontent.com:sub": "repo:<OWNER>/<REPO>:*"
    }
  }
}
```

---

## 🌍 Terraform Resources

| Resource Type    | Description                   |
| ---------------- | ----------------------------- |
| EC2 Instance     | Main compute node             |
| Key Pair         | SSH authentication            |
| Security Group   | Access rules                  |
| VPC *(optional)* | Virtual network               |
| Outputs          | Public IPs, Instance ID, etc. |

---

## 🧪 Local Development

```bash
cd terraform
terraform init
terraform plan -var="public_key_path=~/.ssh/id_rsa.pub"
terraform apply -var="public_key_path=~/.ssh/id_rsa.pub"
```

> ⚠️ Never commit `vars.tfvars`. It is dynamically generated by CI.

---

## 📦 Terraform Outputs

After a successful `apply`, you will see:

```
instance_id = "i-xxxxxxxxxxxxx"
public_ip   = "3.123.45.67"
```

Use the public IP to access your EC2 instance.

---

## 🔎 Troubleshooting

| Issue                    | Fix                                              |
| ------------------------ | ------------------------------------------------ |
| Duplicate Key Pair Error | Automatically resolved via `terraform import`    |
| Duplicate Security Group | Automatically resolved via `terraform import`    |
| Role Not Found in CI     | Ensure `AWS_ROLE_ARN` and trust policy are valid |
| No EC2 Visible           | Check AWS region consistency                     |

---

## ✅ Best Practices Followed

* 🔐 Secure OIDC-based auth (no long-term AWS keys)
* 🧠 Smart handling of duplicate resources
* 📁 Dynamic, ephemeral vars file
* 🔒 Secrets managed via GitHub
* 💬 Clean separation between code, config, and secrets

---

## 📌 Requirements

* AWS Account + IAM Role
* Terraform CLI v1.3+
* GitHub repository + GitHub Actions enabled
* SSH key pair (public key only stored in secret)

---

## 📄 License

MIT License

---

## 🙌 Maintainers

Created and maintained by **@you** as part of the **CI/CD Nerfées** DevOps deployment challenge.

Feel free to open an issue for improvements or additional integrations (e.g., S3, CloudFront, ECS, Lambda).
