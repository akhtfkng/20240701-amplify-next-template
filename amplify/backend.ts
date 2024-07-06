import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource.js';

const backend = defineBackend({
  auth,
});

backend.addOutput({
  storage: {
    aws_region: "us-east-1",
    bucket_name: "testcontents-20240628"
  },
});