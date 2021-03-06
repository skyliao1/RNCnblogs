import * as YZConstants from './common/constants'
import * as YZStorage from './utils/globalStorage'
/* eslint-enable */
import codePush from 'react-native-code-push';
import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    Alert,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    DeviceEventEmitter
} from 'react-native';
import {Provider} from 'react-redux';
import getStore from './store/config-store';
import getNavReducer from './reducers/nav_reducer';
import App from './pages/app';
import AppNav from './pages/app_nav';
import YZLoading from './components/YZLoading';
import YZHeader from './components/YZHeader';
import YZManagementProfile from './components/YZManagementProfile';
import YZStateView from './components/YZStateCommonView';
import YZLottieView from './components/YZLottieView';
import {
    reduxifyNavigator,
    createReactNavigationReduxMiddleware,
} from 'react-navigation-redux-helpers'
import YZPicker from "./components/YZPicker";
import Markdown from 'react-native-markdown-renderer';
import HtmlView from 'react-native-render-html';
import FitImage from 'react-native-fit-image';
import {ScrollableTabBar, DefaultTabBar} from 'react-native-scrollable-tab-view';
import {ReduxState} from "./reducers";
import Realm from "realm";
import {userSchema, tables} from "./common/database";
import {put} from "redux-saga/effects";
import {sagaActionToAction} from "./utils/reduxUtils";
import StringUtils from "./utils/stringUtils";
import Styles from "./common/styles";
//防止ts编译掉
let a = YZConstants;
let b = YZStorage;

// if (process.env.NODE_ENV !== 'development') {
//     global.console = {
//         info: () => {},
//         log: () => {},
//         warn: () => {},
//         error: () => {},
//     };
//     global.alert = () => {};
// }

const navReducer = getNavReducer(AppNav);

//beta28新增--start
// Note: createReactNavigationReduxMiddleware must be run before createReduxBoundAddListener
const middleware = createReactNavigationReduxMiddleware(
    "root",
    (state:ReduxState) => state.nav,
);
const AppWidthNavigator = reduxifyNavigator(AppNav,"root");
//beta28新增--end

const AppWitheNavigationState = (<App  AppNavigator={AppWidthNavigator}/>);


const store = getStore(navReducer,middleware);

const markdownStyles = StyleSheet.create({
    text: {
        fontSize: gFont.sizeDetail,
        color: gColors.color4c
    }
});

//设置markdown规则
const markdownRules = {
    image: (node, children, parent, styles) => {
        return (
            <TouchableOpacity
                key={node.key}
                activeOpacity={activeOpacity}
                style={styles.image}
                onPress={()=>{
                    //由于暂时无法获取到item，所无法获取imgList属性（已解析）,暂时只能显示一张图片
                    DeviceEventEmitter.emit('showImgList',{
                        imgList: [node.attributes.src],
                        imgListIndex: 0
                    });
                }}
            >
                <FitImage indicator={true}
                          resizeMode="contain"
                          style={[styles.image]} source={{ uri: node.attributes.src }} />
            </TouchableOpacity>
        );
    },
    link: async (node, children, parent, styles) => {
        //http://home.cnblogs.com/u/985807/
        console.log(node.attributes.href)
        //说明是@个人用户
        if(node.attributes.href&&node.attributes.href.indexOf('//home.cnblogs.com/u')>0)
        {
            let matches = node.attributes.href.match(/\/u\/\d+?\//);
            if(matches&&matches.length>0) {
                //在本地数据库查找用户，能找到，则找出alias
                let realm;
                try {
                    let userId = matches[0].replace(/\//g,'').replace('u','');
                    console.log(userId)
                    realm = await Realm.open({schema: [userSchema]});
                    let users = realm.objects(tables.user);
                    let curUsers = users.filtered(`id = '${userId}'`);
                    if(curUsers&&curUsers.length>0)
                    {
                        return (
                            <Text key={node.key} style={styles.link} onPress={() => {
                                NavigationHelper.navigate('ProfilePerson',{
                                    userAlias: curUsers[0].alias,
                                    avatorUrl: curUsers[0].iconUrl
                                });
                            }}>
                                {children}
                            </Text>
                        );
                    }
                } catch (e) {
                    console.log(e)
                } finally {
                    if (realm) {
                        realm.close();
                    }
                }
            }
        }
        return (
            <Text key={node.key} style={styles.link} onPress={() => {
                NavigationHelper.navigate('YZWebPage',{
                    uri: node.attributes.href,
                    title: '详情'
                });
            }}>
                {children}
            </Text>
        );
    },
    // a with a non text element nested inside
    blocklink: (node, children, parent, styles) => {
        return (
            <TouchableWithoutFeedback key={node.key} onPress={() => {
                NavigationHelper.navigate('YZWebPage',{
                    uri: node.attributes.href,
                    title: '详情'
                });
            }} style={styles.blocklink}>
                <View style={styles.image}>{children}</View>
            </TouchableWithoutFeedback>
        );
    },
}

class Root extends Component {
    constructor(props) {
        super(props);
        //全局设置 禁止APP受系统字体放大缩小影响
        // @ts-ignore
        Text.defaultProps={...(Text.defaultProps||{}),allowFontScaling:false};
        // @ts-ignore
        TouchableOpacity.defaultProps.activeOpacity= activeOpacity;
        // @ts-ignore
        TextInput.defaultProps={...(TextInput.defaultProps||{}),allowFontScaling:false};
        // @ts-ignore
        TextInput.defaultProps.underlineColorAndroid = "transparent";
        // TextInput.defaultProps.textAlignVertical = false;
        YZHeader.defaultProps.statusBarBackgroundColor=gColors.themeColor;
        // @ts-ignore
        YZHeader.defaultProps.style={backgroundColor:gColors.themeColor};
        // @ts-ignore
        YZHeader.defaultProps.titleStyle={color:gColors.bgColorF,fontWeight:null};
        // @ts-ignore
        YZHeader.defaultProps.statusBarStyle='light-content';
        YZHeader.defaultProps.type='light-content';
        // @ts-ignore
        YZManagementProfile.defaultProps.titleColor = gColors.color7;
        YZPicker.defaultProps.pickerConfirmBtnColor = [12,109,182,1];
        // @ts-ignore
        YZStateView.defaultProps.loadingView = <YZLottieView
            style={{width:120,height:120}}
            speed={2}
            source={require('./resources/animation/trail_loading_2f97a7')}/>;
        Markdown.defaultProps.rules = markdownRules;
        Markdown.defaultProps.style = markdownStyles;
        HtmlView.defaultProps.allowFontScaling = false;
        HtmlView.defaultProps.baseFontStyle = {
            fontSize: gFont.sizeDetail,
            color: gColors.color4c,
            ...Styles.text4Pie
        };
        ScrollableTabBar.defaultProps = {
            ...(ScrollableTabBar.defaultProps || {}),
            activeTextColor: gColors.bgColorF,
            inactiveTextColor: '#DBDBDB',
            underlineStyle: {
                backgroundColor:gColors.bgColorF,
                height:3
            },
            style: {
                backgroundColor: gColors.themeColor
            }
        };
        // UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    render() {
        return (
            <View style={{flex: 1}}>
                <Provider store={store}>
                    {AppWitheNavigationState}
                </Provider>
            </View>
        );
    }
}

let codePushOptions = {checkFrequency: codePush.CheckFrequency.MANUAL};

export default codePush(codePushOptions)(Root);
