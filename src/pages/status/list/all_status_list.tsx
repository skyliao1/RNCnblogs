import React,{Component} from 'react';
import {connect} from "react-redux";
import {getStatusList, clearStatusList} from "../../../actions/status/status_index_actions";
import BaseStatusList, {IBaseStatusProps} from "./base_status_list";
import {DeviceEventEmitter, EmitterSubscription} from "react-native";
import {ReduxState} from "../../../reducers";

interface IProps extends IBaseStatusProps{

}

@connect((state:ReduxState)=>({
    dataList: state.statusIndex.all.list,
    loadDataResult: state.statusIndex.all.getListResult,
    noMore: state.statusIndex.all.noMore,
}),dispatch=>({
    dispatch,
    loadDataFn:(data)=>dispatch(getStatusList(data)),
    clearDataFn:(data)=>dispatch(clearStatusList(data)),
}))
export default class all_status_list extends BaseStatusList<IProps,any>{
    type = 'all';
    private reloadListener:EmitterSubscription;

    constructor(props)
    {
        super(props);
        this.reloadListener = DeviceEventEmitter.addListener('reload_all_status_list',()=>{
            this.pageIndex = 1;
            this.loadData();
        });
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        this.reloadListener&&this.reloadListener.remove();
    }

    getParams = ()=>{
        const params = {
            request:{
                type: this.type,
                pageIndex:this.pageIndex,
                pageSize: 10
            }
        };
        return params;
    }
}