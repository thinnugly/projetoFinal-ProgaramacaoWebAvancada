provider "aws" {
  profile = var.aws_profile != "" ? var.aws_profile : null
  region = "us-east-1"

  default_tags {
    tags = {
      Project = "NodeAPI"
      Environment = "production"
      ManegedBy = "Terraform"
      Owner = "DevOps"
    }
  }
}