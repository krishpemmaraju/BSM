import RestRequest from "../api/actions/RESTRequest";
import UIActions from "../webui/actions/UIActions";
import CustomWorld, { ICustomWorld } from "./CustomWorld";


export async function InitSCMApplicationConfig(customWorld:CustomWorld, pickle:any, data:any){

    console.log(" **********************   TEST STARTED **************************************************** \n");
    console.log(" ****************** EXECUTION STARTED FOR SCENARIO - " + pickle + " ******************* \n");


    type Env = 'dev' | 'stg' | 'staging' | 'tst'
    type EnvKey = 'DEV' | 'STG' | 'TST'

    const envMap: Record<Env, EnvKey> = {
        dev: 'DEV',
        stg: 'STG',
        staging: 'STG',
        tst: 'TST'
    }

    const env = (process.env.ENV?.toLowerCase() as Env) || 'dev';
    const envKey: EnvKey = envMap[env] || 'DEV'

    const scmConfig: any = data[`SCM_${envKey}`][0];
    const vbcsConfig: any = data[`ONPREM_${envKey}`][0];

    Object.assign(customWorld, {
        SCMURL: scmConfig[`SCM${envKey}URL`],
        SCMUSER: scmConfig[`SCM${envKey}USERNAME`],
        SCMPASSWORD: scmConfig[`SCM${envKey}PASSWORD`],
        SCMSTOCKCHKAPI: scmConfig[`SCM${envKey}STOCKCHKAPI`],
        SCMCHKAVAILABILITY: scmConfig[`SCM${envKey}CHKAVAILABILITY`],
        VBCSURL: vbcsConfig[`VBCS${envKey}OCURL`],
        VBCSUSER: vbcsConfig[`VBCS${envKey}OCUSERNAME`],
        VBCSPASSWORD: vbcsConfig[`VBCS${envKey}OCPASSWORD`]
    })
    await customWorld.init('scm');
    customWorld.web = new UIActions(customWorld.page);
    customWorld.rest = new RestRequest(customWorld.page);

}