import React, {Component} from 'react'
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Image,
    Text,
    ScrollView
} from 'react-native'
import {connect} from 'react-redux';
import YZHeader from '../../components/YZHeader';
import Styles from '../../common/styles';
import Entypo from 'react-native-vector-icons/Entypo';
import {ListRow} from 'teaset';
import {logout} from '../../actions/login/login_index_actions'
import {ReduxState} from '../../reducers';
import {NavigationScreenProp, NavigationState} from "react-navigation";

interface IProps extends IReduxProps{
    isLogin?: boolean,
    userInfo?: any,
    logoutFn?: any,
    navigation: NavigationScreenProp<NavigationState>,
    tabIndex: number
}

interface IState {

}

@connect((state: ReduxState)=>({
    userInfo: state.loginIndex.userInfo,
    isLogin: state.loginIndex.isLogin
}),dispatch=>({
    dispatch,
    logoutFn:(data)=>dispatch(logout(data))
}))
export default class profile_index extends Component<IProps,IState> {

    render() {
        const {userInfo} = this.props;
        return (
            <View
                style={[Styles.container]}>
                <YZHeader title="我"
                          style={{
                              backgroundColor: gColors.themeColor,
                              marginTop: __ANDROID__?-gScreen.statusBarHeight:0
                          }}
                          statusBarBackgroundColor={gColors.themeColor}
                          // style={{marginTop:__ANDROID__?-gScreen.statusBarHeight:0}}
                          showGoBack={false}
                />
                <ScrollView style={{flex:1}}>
                    {this.props.isLogin ?
                        <TouchableOpacity
                            activeOpacity={activeOpacity}
                            style={{marginTop: 10}}
                        >
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                backgroundColor: gColors.bgColorF,
                                paddingHorizontal: 13,
                                paddingVertical: 10
                            }}>
                                {userInfo.Avatar ?
                                    <Image
                                        style={[styles.avator]}
                                        resizeMode={"contain"}
                                        source={{uri: userInfo.Avatar}}
                                    />
                                    :
                                    <View style={[styles.avator]}/>
                                }
                                <View style={{marginLeft: 10, flex: 1}}>
                                    <Text style={{
                                        fontSize: gFont.size17,
                                        color: gColors.color0
                                    }}>{userInfo.DisplayName}</Text>
                                    <Text style={{
                                        fontSize: gFont.size13,
                                        color: gColors.color666,
                                        marginTop: 6
                                    }}>{userInfo.Seniority}</Text>
                                </View>
                                {/*<Entypo name="chevron-thin-right" size={18} color={gColors.color999}/>*/}
                            </View>
                        </TouchableOpacity>
                        :
                        <TouchableOpacity
                            activeOpacity={activeOpacity}
                            style={{marginTop: 10}}
                            onPress={()=>{
                                NavigationHelper.navigate('Login');
                            }}
                        >
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                backgroundColor: gColors.bgColorF,
                                paddingHorizontal: 13,
                                paddingVertical: 15
                            }}>
                                <Text style={{flex:1}}>点击登录</Text>
                                <Entypo name="chevron-thin-right" size={18} color={gColors.color999}/>
                            </View>
                        </TouchableOpacity>
                    }
                    <View style={{marginTop:10}}>
                        <ListRow
                            activeOpacity={activeOpacity}
                            title="我的博文"
                            icon={
                                <Entypo
                                    style={{marginRight:6}}
                                    size={18}
                                    color={gColors.themeColor}
                                    name="rss"
                                    />
                            }
                            onPress={()=>{
                                if(this.props.isLogin) {
                                    this.props.navigation.navigate('MyBlogList');
                                }
                                else
                                {
                                    NavigationHelper.navigate('Login');
                                }
                            }}
                        />
                        <ListRow
                            activeOpacity={activeOpacity}
                            title="我的收藏"
                            icon={
                                <Entypo
                                    style={{marginRight:6,marginLeft: -5}}
                                    size={23}
                                    color={gColors.colorRed}
                                    name="star"
                                />
                            }
                            onPress={()=>{
                                if(this.props.isLogin) {
                                    NavigationHelper.navigate('Bookmark');
                                }
                                else
                                {
                                    NavigationHelper.navigate('Login');
                                }
                            }}
                        />
                    </View>
                    <View style={{marginTop:10}}>
                        <ListRow
                            activeOpacity={activeOpacity}
                            title="系统设置"
                            icon={
                                <Entypo
                                    style={{marginRight:6}}
                                    size={18}
                                    color={gColors.themeColor}
                                    name="cog"
                                />
                            }
                            onPress={()=>{
                                this.props.navigation.navigate('ProfileSetting');
                            }}
                        />
                    </View>
                </ScrollView>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    avator: {
        width: 50,
        height: 50
    }
});
