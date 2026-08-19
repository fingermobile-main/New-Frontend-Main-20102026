/* global require, module, process */
require("dotenv").config();

module.exports = {accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || "us-east-1",
  s3: {,
  bucket: process.env.S3_BUCKET || "fingermobile-uploads",
  region: process.env.AWS_REGION || "us-east-1"
  },
cloudfront: {distributionId: process.env.CLOUDFRONT_DISTRIBUTION_ID,
  domain: process.env.CLOUDFRONT_DOMAIN
  },
ivs: {channelArn: process.env.IVS_CHANNEL_ARN,
  streamKeyArn: process.env.IVS_STREAM_KEY_ARN
  },
lambda: {region: process.env.AWS_REGION || "us-east-1"
  }
};
