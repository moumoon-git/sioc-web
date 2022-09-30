import { nextTick } from "vue";

export default function useFun($store:any){

    /**
    * @desc 退出飞巡
    * @param {}
    * @returns {}
    */
    const escFlightFun = () =>{
        nextTick(()=>{
            $store.commit('flightPatrol/SET_isShowFlightTip',false);
            console.log($store.state.flightPatrol.isShowFlightTip)
        })
    }
    const intoFlightFun = () =>{
        nextTick(()=>{
            $store.commit('flightPatrol/SET_isShowFlightTip',true);
            console.log($store.state.flightPatrol.isShowFlightTip)
        })
    }
    return {
        escFlightFun,
        intoFlightFun
    }
}