[![npm version](https://badge.fury.io/js/ec2-price.svg)](http://badge.fury.io/js/ec2-price)

ec2-price
----

Retrieve the latest EC2 prices via command line.

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

You can specify a particular type across all regions.

````shell
$ ec2-price --type c4.2xlarge
````

You can specify a region and a particular type.

````shell
$ ec2-price --region us-west-1 --type c4.2xlarge
````
