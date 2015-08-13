var fetch = require('node-fetch')
var argv = require('minimist')(process.argv.slice(2))
var columnify = require('columnify')

const AWS_PRICE_JS_URL = 'http://a0.awsstatic.com/pricing/1/ec2/linux-od.min.js'
const AWS_REGIONS = [
  'ap-northeast-1',
  'ap-southeast-1',
  'ap-southeast-2',
  'eu-central-1',
  'eu-west-1',
  'sa-east-1',
  'us-east-1',
  'us-gov-west-1',
  'us-west-1',
  'us-west-2',
]

// help
if (argv.h || argv.help) {
  console.log('Usage:');
  console.log('  ec2-price [-r region]');
  console.log();
  console.log('Options:');
  console.log('  -h, --help       help message');
  console.log('  -v, --verbose    output price with the instance spec');
  console.log('      --version    version info');
  console.log('  -r, --region [REGION]   specify region (%s)');
  process.exit();
}

// version
if (argv.version) {
  console.log('Version: ' + require('./package').version);
  process.exit();
}

// region check
var _region = argv.r || argv.region;
if (_region) {
  if (AWS_REGIONS.indexOf(_region) < 0) {
    console.log('invalid region');
    console.log();
    console.log('Available regions are:');
    console.log(AWS_REGIONS.join('\n'));
    process.exit(1);
  }
}

fetch(AWS_PRICE_JS_URL)
  .then(function(res) {
    return res.text();
  }).then(function(body) {
    var callback = function(obj) {
      var selected_region = (_region) ? obj.config.regions.filter(function(i) { return i.region == _region }) : obj.config.regions

      for (var region of selected_region) {
        console.log('REGION: ' + region.region) 
        console.log('----------------------')
        var price_data = []

        for (var instanceType of region.instanceTypes) {
          for (var size of instanceType.sizes) {
            data = {}

            if (argv.v) {
              data = { 
                name: size.size,
                "v-CPU": size.vCPU,
                ECU: size.ECU,
                memory: size.memoryGiB,
                strorage: size.storageGB,
                price: size.valueColumns[0].prices.USD,
              }
            } else {
              data = {
                name: size.size,
                price: size.valueColumns[0].prices.USD,
              }
            }
            
            price_data.push(data);
          }
        }
        console.log(columnify(price_data));
        console.log(''); 
      }
    };

    eval(body);
  }).catch(function(e) {
    console.log(e);
  });

