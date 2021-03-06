import React, {Component, PureComponent} from 'react'
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Image,
    Text,
    TextInput, DeviceEventEmitter
} from 'react-native'
import {connect} from 'react-redux';
import YZStateView from '../../components/YZStateCommonView';
import YZFlatList from '../../components/YZFlatList';
import YZCheckbox from '../../components/YZCheckbox';
import Styles from '../../common/styles';
import Feather from 'react-native-vector-icons/Feather';
import {ListRow} from 'teaset';
import PropTypes from 'prop-types';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import {addStatus} from '../../actions/status/status_index_actions';
import {showToast} from "../../actions/app_actions";
import {NavigationScreenProp, NavigationState} from "react-navigation";

interface IProps extends IReduxProps{
    item: any,
    clickable: boolean,
    navigation: NavigationScreenProp<NavigationState>,
    addStatusFn?: any
}

interface IState {

}

@connect(state=>({

}),dispatch=>({
    showToastFn:(data)=>dispatch(showToast(data)),
    addStatusFn:(data)=>dispatch(addStatus(data))
}))
export default class status_add extends PureComponent<IProps,IState> {

    static propTypes = {
        item: PropTypes.object,
        clickable: PropTypes.bool
    };

    static defaultProps = {
        clickable: true
    };

    static navigationOptions = ({navigation})=>{
        const {state} = navigation;
        const {rightAction} = state.params || {rightAction: undefined};
        return {
            title: '发布闪存',
            headerRight: (
                <TouchableOpacity
                    activeOpacity={activeOpacity}
                    style={{alignSelf:'stretch',justifyContent:'center',paddingHorizontal:8}}
                    onPress={rightAction}
                >
                    <FontAwesome name="send" size={18} color={gColors.bgColorF} />
                </TouchableOpacity>
            )
        };
    }

    state = {
        value: '',
        isPrivate: false
    };

    componentDidMount() {
        this.props.navigation.setParams({
            rightAction: this._rightAction
        });
    }

    _rightAction=()=>{
        if(!this.state.value)
        {
            this.props.showToastFn('请填写内容');
            return;
        }
        const {addStatusFn} = this.props;
        addStatusFn({
            request: {
                Content: this.state.value,
                IsPrivate: this.state.isPrivate
            },
            successAction: ()=>{
                //返回到上一级，并刷新所有的列表
                this.props.navigation.goBack();
                //刷新‘全站’和‘我的'两个列表
                DeviceEventEmitter.emit('reload_all_status_list');
                DeviceEventEmitter.emit('reload_my_status_list');
            }
        });
    }

    render() {
        const {item, clickable} = this.props;
        return (
            <View style={[Styles.container,{backgroundColor:gColors.bgColorF}]}>
                <TextInput
                    placeholder={'你在做什么？你在想什么？'}
                    textAlignVertical="top"
                    underlineColorAndroid="transparent"
                    style={[{padding:8, fontSize: gFont.size15, color: gColors.color333,height:gScreen.height*0.4}]}
                    value={this.state.value}
                    multiline={true}
                    onChangeText={value=>this.setState({value})}
                />
                <View style={{height:1,backgroundColor:gColors.borderColor}}/>
                <View style={{marginTop:10,flexDirection:'row',justifyContent:'flex-end',paddingRight:10}}>
                    <TouchableOpacity
                        activeOpacity={activeOpacity}
                        onPress={()=>{
                            this.setState({
                                isPrivate: false
                            })
                        }}
                        style={{flexDirection:'row',alignItems:'center'}}>
                        <YZCheckbox
                            checked={!this.state.isPrivate}
                            size={20}
                            onPress={()=>{
                                this.setState({
                                    isPrivate: false
                                })
                            }}
                            />
                        <Text style={{marginLeft:4}}>公开</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={activeOpacity}
                        onPress={()=>{
                            this.setState({
                                isPrivate: true
                            })
                        }}
                        style={{flexDirection:'row',alignItems:'center',marginLeft:18}}>
                        <YZCheckbox
                            checked={this.state.isPrivate}
                            size={20}
                            onPress={()=>{
                                this.setState({
                                    isPrivate: true
                                })
                            }}
                        />
                        <Text style={{marginLeft:4}}>私有</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    avator: {
        width:20,
        height:20,
        borderRadius:10,
    }
});
