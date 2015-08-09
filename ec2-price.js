var fetch = require('node-fetch');
var argv = require('minimist')(process.argv.slice(2));
var columnify = require('columnify')

const AWS_PRICE_JS_URL = 'http://a0.awsstatic.com/pricing/1/ec2/linux-od.min.js'
//const AWS_REGIONS = [
  //'us-east-1',
  //'us-west-1',
  //'us-west-2',
//];

fetch(AWS_PRICE_JS_URL)
  .then(function(res) {
    return res.text();
  }).then(function(body) {
    var callback = function(obj) {
      var selected_region = (argv.region) ? obj.config.regions.filter(function(i) { return i.region == argv.region }) : obj.config.regions

      for (var region of selected_region) {
        console.log('REGION: ' + region.region); 
        console.log('----------------------'); 
        var price_data = {}

        for (var instanceType of region.instanceTypes) {
          for (var size of instanceType.sizes) {
            price_data[size.size] = '$' + size.valueColumns[0].prices.USD
          }
        }
        console.log(columnify(price_data, { columns: ['Name', 'Price']}));
        console.log(''); 
      }
    };

    eval(body);
  }).catch(function(e) {
    console.log(e);
  });

