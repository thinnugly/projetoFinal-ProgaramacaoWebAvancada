terraform {
  backend "s3" {
    bucket = "devwn-terraform-state"
    key = "infra/terraform.tfstate"
    region = "us-east-1"
    dynamodb_table = "devwn-terraform-lock"
    profile = "node_api"
    encrypt = true
  }
}

module "node_ec2" {
  source = "./modules/ec2"
}