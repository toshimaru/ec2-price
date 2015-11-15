var fetch = require('node-fetch');
var argv = require('minimist')(process.argv.slice(2));
var columnify = require('columnify');

const AWS_PRICE_JS_URL = 'http://a0.awsstatic.com/pricing/1/ec2/linux-od.min.js';

// help
if (argv.h || argv.help) {
  console.log('Usage:');
  console.log('  ec2-price [-r region] [-t type]');
  console.log();
  console.log('Options:');
  console.log('  -h, --help            help message');
  console.log('  -v, --verbose         prices with instance specs');
  console.log('      --version         version');
  console.log('  -r, --region [REGION] specify a region');
  console.log('  -t, --type [TYPE]     specify a type');
  process.exit();
}

// version
if (argv.version) {
  console.log('Version: ' + require('./package').version);
  process.exit();
}

// region
var _region = argv.r || argv.region;

// type
var _type = argv.t || argv.type;

// verbose
var _verbose = argv.v || argv.verbose;

fetch(AWS_PRICE_JS_URL)
  .then(function(res) {
    return res.text();
  })
  .then(function(body) {
    var callback = function(obj) {
      var selected_region = (_region) ? obj.config.regions.filter(function(i) { return i.region == _region; }) : obj.config.regions;

      for (var region of selected_region) {
        console.log('REGION: ' + region.region);
        console.log('----------------------');
        var price_data = [];

        for (var instanceType of region.instanceTypes) {
          for (var size of instanceType.sizes) {
            data = {};

            if(_type && size.size != _type) {
              continue;
            }

            if (_verbose) {
              data = {
                name: size.size,
                "v-CPU": size.vCPU,
                ECU: size.ECU,
                memory: size.memoryGiB,
                strorage: size.storageGB,
                price: size.valueColumns[0].prices.USD,
              };
            } else {
              data = {
                name: size.size,
                price: size.valueColumns[0].prices.USD,
              };
            }

            price_data.push(data);
          }
        }
        console.log(columnify(price_data));
        console.log('');
      }
    };

    eval(body); // callback function is called by `eval()`
  })
  .catch(function(e) {
    console.error(e);
    exit(1);
  });
