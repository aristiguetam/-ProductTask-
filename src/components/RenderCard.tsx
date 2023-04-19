import React from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native';

import { useNavigation } from '@react-navigation/native';

import { Producto } from '../interfaces/appInterfaces';


export const RenderCard = (item: Producto) => {
    
    const navigation = useNavigation()

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={
                () => navigation.navigate('ProductScreen', {
                    id: item._id,
                    name: item.nombre,
                })
            }
        >

            <View style={{ justifyContent: 'center', alignItems: 'center' }}>

                <View style={{
                    backgroundColor: 'black',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: 10,
                    width: 280,
                    height: 200,
                    borderRadius: 5,
                    paddingHorizontal: 2
                }} >

                    <Text style={styles.productName}> {item.nombre}</Text>

                    {
                        item.img ? (
                            <View>
                                <Image source={{ uri: item.img }} style={{ width: 150, height: 125 }} />
                            </View>
                        ) : <View>
                            <Image source={require('../assets/react-logo-white.png')} style={{ width: 150, height: 125 }} />
                        </View>
                    }



                    <View style={{ flexDirection: 'row', paddingHorizontal: 5, backgroundColor: '#a335ef', height: 40, width: 280, borderRadius: 5 }}>

                        <Text style={{ color: 'white', marginTop: 15, fontWeight: 'bold' }}>
                            Prices: {item.precio}
                        </Text>

                        <View style={{ flex: 1 }} />

                        <Text style={{ color: 'white', marginTop: 15, fontWeight: 'bold' }}>
                            Category: {item.categoria.nombre}
                        </Text>

                    </View>

                </View>

            </View>
        </TouchableOpacity>
    )

}
