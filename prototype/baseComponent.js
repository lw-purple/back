import fetch from 'node-fetch';

export default class BaseComponent{
    constructor(){

    }
   async fetch(url='',data={},type='GET',resType='JSON'){
       type = type.toUpperCase();
       resType=resType.toUpperCase();
       if(type== 'GET'){
           let dataStr ='';
           
       }
   }
}