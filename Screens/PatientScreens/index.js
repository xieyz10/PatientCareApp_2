import React, { useContext } from 'react'
import { StyleSheet, TextInput, Text, View, ImageBackground, Image, TouchableOpacity, ScrollView } from 'react-native';
import { PatientInfoCard } from '../../Components/PatientInfoCard/index.js';
import { useNavigation } from '@react-navigation/native';
import { httpGetRequest } from '../../utils/http.js'
import { UserContext } from '../../UserContext.js'
import { PatientList } from '../../Components/PatientList/index.js'


export const PatientScreen = ({ props }) => {
    const navigation = useNavigation();
    const [patients, setPatients] = React.useState([])
    const [hasLoaded, setHasLoaded] = React.useState(false)
    const [searchText, setSearchText] = React.useState("")
    const { user } = useContext(UserContext)

    React.useEffect(() => {
        const willFocusSubscription = navigation.addListener('focus', () => {
            httpGetRequest(`patients?doctorID=${user._id}`, 'GET')
                .then(async res => {
                    if (res.ok) {
                        return await res.json()
                    } else {
                        return Promise.reject(await res.json());
                    }
                })
                .then(data => {
                    setPatients(data)
                    setHasLoaded(true)
                })
        });
        return willFocusSubscription;
    }, [])

    const button_search_pressed = () => {
        if(searchText == ""){
            httpGetRequest(`patients?doctorID=${user._id}`, 'GET')
            .then(async res => {
                if (res.ok) {
                    return await res.json()
                } else {
                    return Promise.reject(await res.json());
                }
            })
            .then(data => {
                setPatients(data)
                setHasLoaded(true)
            })
        }else{
            httpGetRequest(`name?patientName=${searchText}&doctorID=${user._id}`, 'GET')
            .then(async res => {
                if (res.ok) {
                    return await res.json()
                } else {
                    return Promise.reject(await res.json());
                }
            })
            .then(data => {
                setPatients(data)
                setHasLoaded(true)
            })
        }
    }

    const renderPatientList = () => {
        return (
            <PatientList />
        )
    }

    return (
        <View style={styles.view_container}>
            {/* <ImageBackground source={require('../../assets/background.jpg')} resizeMode="cover" style={{ flex: 1 }}> */}
            <View>
                <View style={styles.view_Header}>
                    <Text style={{ fontSize: 30, fontWeight: 'bold', color: '#000000' }}>Patient {'\n'}Search / List</Text>
                </View>
                <View style={styles.container_view_PatientList}>
                    <View style={styles.view_PatientList}>

                        <TextInput
                            style={styles.textinput}
                            placeholder="Search Patient"
                            onChangeText={text => setSearchText(text)}
                            >
                        </TextInput>

                        <TouchableOpacity
                            style={styles.touchableOpacity_PatientList}
                            onPress={button_search_pressed}
                            >
                            <Text style={{ color: '#FFFFFF' }}>Search</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <View style={styles.view_ResultList}>
                <ScrollView>
                    {/* {renderPatientList()} */}
                    {hasLoaded ? patients.map((patient, key) => {
                        return (<PatientInfoCard key={key} patient={patient} />)
                    }):""}
                </ScrollView>
            </View>
            {/* </ImageBackground> */}
        </View>
    )
}

const styles = StyleSheet.create({
    view_container: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    },
    view_Header: {
        width: '90%',
        flexDirection: 'row',
        marginTop: 70,
        marginLeft: '5%'
    },
    container_view_PatientList: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10
    },
    touchableOpacity_PatientList: {
        width: 70,
        height: 40,
        borderRadius: 100,
        backgroundColor: '#1589FF',
        color: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 90
    },
    view_PatientList: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        width: '90%',
        height: 60,
        alignItems: 'center',
        borderRadius: 20,
    },
    view_ResultList: {
        width: '90%',
        justifyContent: 'center',
        marginLeft: '5%',
        height: '70%',
    },
    textinput: {
        height: 40,
        width: 180,
        fontSize: 20,
        marginBottom: 0,
        marginLeft: 10
    },
})