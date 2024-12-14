provider "aws" {
  region     = var.aws_region
  access_key = var.aws_access_key
  secret_key = var.aws_secret_key
}

# Create VPC
resource "aws_vpc" "example" {
  cidr_block = "10.0.0.0/16"
}

# Create Subnet1 in the ap-south-1a availability zone
resource "aws_subnet" "subnet1" {
  vpc_id                  = aws_vpc.example.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = "ap-south-1a"
  map_public_ip_on_launch = true
}

# Create Subnet2 in the ap-south-1b availability zone
resource "aws_subnet" "subnet2" {
  vpc_id                  = aws_vpc.example.id
  cidr_block              = "10.0.2.0/24"
  availability_zone       = "ap-south-1b"
  map_public_ip_on_launch = true
}

# Create Internet Gateway for VPC
resource "aws_internet_gateway" "example" {
  vpc_id = aws_vpc.example.id
}

# Create Security Group for ECS Service
resource "aws_security_group" "sg" {
  name_prefix = "ecs-sg"
  description = "Allow inbound traffic to ECS service"
  vpc_id      = aws_vpc.example.id

  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# S3 Bucket for file uploads (Force deletion of the bucket and its content)
resource "aws_s3_bucket" "uploads" {
  bucket = var.s3_bucket_name
  force_destroy = true
}

# IAM Role for ECS Task Execution
resource "aws_iam_role" "ecs_task_execution_role" {
  name               = "${var.app_name}-ecs-task-execution-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action    = "sts:AssumeRole"
        Effect    = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })
}

# Attach the ECS Task Execution policy to the ECS role
resource "aws_iam_role_policy_attachment" "ecs_task_execution_policy" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonECSTaskExecutionRolePolicy"
}

# ECS Cluster
resource "aws_ecs_cluster" "example" {
  name = "my-cluster"
}

# ECS Task Definition
resource "aws_ecs_task_definition" "example" {
  family                   = "my-task-family"
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
  task_role_arn            = aws_iam_role.ecs_task_execution_role.arn
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"

  container_definitions = jsonencode([{
    name      = "my-container"
    image     = "my-docker-image:latest"
    essential = true
    portMappings = [
      {
        containerPort = 3000
        hostPort      = 3000
        protocol      = "tcp"
      }
    ]
  }])
}

# ECS Service using Fargate
resource "aws_ecs_service" "example" {
  name            = "my-service"
  cluster         = aws_ecs_cluster.example.id
  task_definition = aws_ecs_task_definition.example.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = [aws_subnet.subnet1.id, aws_subnet.subnet2.id]  # Using two subnets across different AZs
    security_groups  = [aws_security_group.sg.id]  # Your security group
    assign_public_ip = true
  }
}

# Application Load Balancer (ALB)
resource "aws_lb" "example" {
  name               = "my-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.sg.id]
  subnets            = [aws_subnet.subnet1.id, aws_subnet.subnet2.id]  # Multiple subnets across different AZs

  enable_deletion_protection = false
  enable_cross_zone_load_balancing = true
}

# Target Group for Load Balancer
resource "aws_lb_target_group" "example" {
  name     = "my-target-group"
  port     = 80
  protocol = "HTTP"
  vpc_id   = aws_vpc.example.id
  target_type = "ip"  # Set to 'ip' for Fargate
}

# Attach ECS Service to Load Balancer
resource "aws_ecs_service" "example_with_lb" {
  name            = "my-service-with-lb"
  cluster         = aws_ecs_cluster.example.id
  task_definition = aws_ecs_task_definition.example.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  load_balancer {
    target_group_arn = aws_lb_target_group.example.arn
    container_name   = "my-container"
    container_port   = 3000
  }

  network_configuration {
    subnets          = [aws_subnet.subnet1.id, aws_subnet.subnet2.id]
    security_groups  = [aws_security_group.sg.id]
    assign_public_ip = true
  }

  depends_on = [
    aws_lb_target_group.example,
    aws_lb.example
  ]
}

# Output Load Balancer URL
output "load_balancer_url" {
  value = aws_lb.example.dns_name
}
