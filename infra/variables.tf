
variable "aws_access_key" {}
variable "aws_secret_key" {}
variable "aws_region" {
  default = "us-east-1"
}

variable "s3_bucket_name" {
  default = "todoapiuploadsmalinda"
}

variable "dynamodb_table_name" {
  default = "todosmalinda"
}

variable "app_name" {
  default = "todo-api-app"
}
