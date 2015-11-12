[![npm version](https://badge.fury.io/js/ec2-price.svg)](http://badge.fury.io/js/ec2-price)

ec2-price
----

Retrieve the latest EC2 price via a command line.

## Installation

```
npm install ec2-price -g
```

## Usage

Output all prices in all regions.

```shell
$ ec2-price
```

You can specify a region.

```shell
$ ec2-price --region us-east-1
```

You can specify a type across all regions.

````shell
$ ec-price --type c4.2xlarge
````

Finally, you can specify a region and type.

````shell
$ ec2-price --region us-west-1 --type c4.2xlarge
````
