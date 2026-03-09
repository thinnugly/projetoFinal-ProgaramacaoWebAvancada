output "ec2_public_ip" {
  value = aws_instance.node_ec2.placement_partition_number
}