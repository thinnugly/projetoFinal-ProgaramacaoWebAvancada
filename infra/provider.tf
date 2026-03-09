provider "aws" {
  profile = "node_api"
  region = "us-east-1"

  default_tags {
    tags = {
      Project = "nodeAPI"
      Environment = "production"
      ManegedBy = "Terraform"
      Owner = "DevOps"
    }
  }
}