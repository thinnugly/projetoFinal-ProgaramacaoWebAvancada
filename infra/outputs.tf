output "ec2_public_ip" {
  value = module.node_ec2.ec2_public_ip
}

output "private_key_pem" {
  value = module.node_ec2.private_key_pem
  sensitive = true
}