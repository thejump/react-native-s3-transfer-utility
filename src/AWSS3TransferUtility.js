
import React, { Component } from 'react';
import {
  Platform,
  NativeModules,
  NativeAppEventEmitter,
  DeviceEventEmitter
} from 'react-native';
var s3Client = NativeModules.AWSRNS3TransferUtility
var listener;
if (Platform.OS === 'ios'){
  listener = NativeAppEventEmitter;
}else{
  listener = DeviceEventEmitter;
}
export default class AWSS3TransferUtility{
  constructor(){
    listener.addListener("ProgressEventUtility", async event => {
      this.progressEvent(event.requestid,event.completedunitcount,event.totalunitcount,event.fractionCompleted,event.type);
    });
    listener.addListener("CompletionHandlerEvent", async event => {
      this.completionHandlerEvent(event.requestid,event.error,event.request);
    });
  }
  /*
  * The progress feedback block.
  * @param {string} requestid
  * @param {number} completedUnits
  * @param {number} totalUnits
  * @param {number} fractionCompleted
  * @param {string} type
  * @example
  * InstanceOfAWSS3TransferUtility.progressEvent = function(requestid,completedUnits,totalUnits,fractionCompleted,type){
  *     console.log("Request ID: " + requestid)
  *     console.log("completedUnits: " + completedUnits)
  *     console.log("totalUnits: " + totalUnits)
  *     console.log("fraction: " + fractionCompleted)
  *     console.log("type: " + type)
  * }
  */
  progressEvent(requestid,completedUnits,totalUnits,fractionCompleted,type){
  }
  /*
  * The completion feedback block.
  * @param {string} requestid
  * @param {map} error
  * @param {map} request
  * @example
  * InstanceOfAWSS3TransferUtility.completionHandlerEvent = function(requestid,error,request){
  *     console.log("Request ID: " + requestid)
  *     console.log("error: " + error)
  *     console.log("request: " + request)
  * }
  */
  completionHandlerEvent(requestid,error,request){
  }
  /*
  * Constructs a new TransferUtility specifying the region
  * @param {string} region - the S3 bucket location
  * @example
  * InstanceOfAWSS3TransferUtility.initWithOptions({"region":"bucketRegion"})
  */
  initWithOptions(options){
    if(options.region){
      s3Client.initWithOptions({"region":options.region,"identity_pool_id":options.identity_pool_id});
    }else{
      console.error("undefined region field")
    }
  }


  /*
  * Creates a download request and returns an ID to represent a upload task.
  * @param {string} bucket - the bucket name
  * @param {string} key - the object key
  * @param {string} path - the object path (only necessary for android)
  * @param {boolean} subscribe - set to true to recieve events to ProgressEventUtility
  * @param {boolean} completionhandler - set to true to recieve events to CompletionHandlerEvent
  * @param {Requester~requestIDCallback} cb - The callback that recieves a value of the
  * requestID to be used in further transactions
  * @example
  * InstanceOfAWSS3TransferUtility.createDownloadRequest({"path":"pathName","bucket":"bucketName","key":"objectKey",
  * "subscribe":true,"completionhandler":true},(error,value)=>{
  *   if(!error){
  *     console.log("My requestID: " + value)
  *   }
  * })
  */
  createDownloadRequest(options,callback){
    s3Client.createDownloadRequest(options,callback);
  }
  /*
  * Downloads the specified Amazon S3 object to a file URL.
  * @param {string} requestid - the request id obtained from createDownloadRequest.
  * @example
  * async function download(){
  *   try{
  *     var val = await RNS3.download({"requestid":value});
  *   }catch(e){
  *     console.log("download failed: " + e)
  *   }
  * }
  * download();
  * @returns {map} request - Empty if successful.
  */
  async download(options){
    var returned =  await s3Client.download(options);
    return returned;
  }

  /*
  * Creates a upload request and returns an ID to represent a upload task.
  * @param {string} bucket - the bucket name
  * @param {string} key - the object key
  * @param {string} contenttype - the object's type
  * @param {string} path - the object's current path for android and uri for iOS
  * @param {boolean} subscribe - set to true to recieve events to ProgressEventUtility
  * @param {boolean} completionhandler - set to true to recieve events to CompletionHandlerEvent
  * @param {Requester~requestIDCallback} cb - The callback that recieves a value of the
  * requestID to be used in further transactions
  * @example
  * InstanceOfAWSS3TransferUtility.createUploadRequest({"path":"pathName","contenttype":"image/jpeg","bucket":"bucketName","key":"objectKey",
  * "subscribe":true,"completionhandler":true},(error,value)=>{
  *   if(!error){
  *     console.log("My requestID: " + value)
  *   }
  * })
  */
  createUploadRequest(options,callback){
    s3Client.createUploadRequest(options,callback);
  }
  /*
  * Uploads the file to the specified Amazon S3 bucket.
  * @param {string} requestid - the request id obtained from createUploadRequest.
  * @example
  * async function upload(){
  *   try{
  *     var val = await InstanceOfAWSS3TransferUtility.upload({"requestid":value});
  *   }catch(e){
  *     console.log("upload failed: " + e)
  *   }
  * }
  * upload();
  * @returns {map} request
  */
  async upload(options){
    var returned =  await s3Client.upload(options);
    return returned;
  }
  /*
  * edits (a) request(s) by either pausing, resuming, or canceling it/them.
  * @param {String} request - the request id obtained from createDownloadRequest. Please provide this OR option but not both.
  * @param {String} config - the type of operation being done (pause, resume, or cancel).
  * @param {String} option - The request type to be modified (upload, download, or all). Please provide this OR request but not both.
  * @example
  * cancel a specific request
  * InstanceOfAWSS3TransferUtility.editEvent({"config":"cancel;","request":requestID})
  * cancels all uploads ocurring
  * InstanceOfAWSS3TransferUtility.editEvent({"config":"cancel","option":"upload"})
  */
  editEvent(options){
    s3Client.editRequest(options);
  }


  canSuspendIfBackground  () {
    if (Platform.OS === 'ios') {
      NativeModule.canSuspendIfBackground();
    }
  };

}
