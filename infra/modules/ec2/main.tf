resource "aws_instance" "node_ec2" {
  ami = "ami-0b6c6ebed2801a5cb"
  instance_type = var.instance_type
  key_name = aws_key_pair.ec2_key.key_name
  security_groups = [ aws_security_group.node_api_sg.name ]

  tags = {
    Name = "node_ec2"
  }
}