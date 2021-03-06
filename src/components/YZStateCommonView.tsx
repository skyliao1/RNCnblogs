/**
 * 在YZStateCoomonView的基础上面，根据目前的框架传递一些属性，与框架强绑定
 */


import React,{Component} from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import YZStateView,{IProps as IYZStateViewProps} from './YZStateView';
import {ReduxState} from '../reducers';

export interface IProps extends IYZStateViewProps{
    mustLogin?: boolean,
    isLogin?: boolean,
    getResult: any
}

// @connect(state=>({
//     isLogin: state.loginIndex.isLogin
// }),dispatch=>({
//     dispatch,
// }))
export default class YZStateCommonView extends YZStateView<IProps>
{
    static propTypes = {
        ...YZStateView.propTypes,
        placeholderTitle:PropTypes.string.isRequired,      //替换标题
        placeholderImageRes:PropTypes.number,   //替换图片原，格式为require('...')
        errorButtonAction:PropTypes.func, //标题样式
        getResult:PropTypes.object.isRequired,
        mustLogin: PropTypes.bool //必须登录才能显示数据
    };


    static defaultProps = {
        ...YZStateView.defaultProps,
        placeholderImageStyle:{
            width:60,
            height:70
        },
        mustLogin: false
    };

    render()
    {
        const {getResult,placeholderTitle,placeholderImageRes,errorButtonAction} = this.props;
        if(!this.props.isLogin&&this.props.mustLogin)
        {
            return (
                <View style={{flex:1,justifyContent:'center',alignItems:'center',
                    }}>
                    <TouchableOpacity
                        activeOpacity={activeOpacity}
                        onPress={()=>{
                            NavigationHelper.navigate('Login',{
                                callback: ()=>{
                                    this.props.errorButtonAction&&this.props.errorButtonAction();
                                }
                            });
                        }}
                        style={{paddingHorizontal:14,paddingVertical:9,backgroundColor:gColors.themeColor,borderRadius:3}}
                    >
                        <Text style={{color:gColors.bgColorF}}>登录</Text>
                    </TouchableOpacity>
                </View>
            );
        }
        return(
            <YZStateView {...this.props}
                         state={getResult.state}
                         placeholderTitle={placeholderTitle}
                         placeholderImageRes={placeholderImageRes}
                         error={getResult.error||{}}
                         errorButtonAction={errorButtonAction}
                         // loadingView={getResult.showLoading?null:<View />}
            />
        );
    }
}

const Wrapped = connect((state: ReduxState)=>({
    isLogin: state.loginIndex.isLogin
}),dispatch=>({
    dispatch,
}))(YZStateCommonView);
//为了暴露出loadingView设置默认值
Wrapped.defaultProps = {
    loadingView: PropTypes.element
};

module.exports = Wrapped;