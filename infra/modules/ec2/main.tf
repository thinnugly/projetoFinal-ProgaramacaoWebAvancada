resource "aws_instance" "node_ec2" {
  ami = "ami-0b6c6ebed2801a5cb"
  instance_type = var.instance_type
  iam_instance_profile = aws_iam_instance_profile.ec2_profile.name
  security_groups = [ aws_security_group.node_api_sg.name ]

  tags = {
    Name = "node_ec2"
  }
}