import { useContext, useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, View, TouchableOpacity, RefreshControl } from 'react-native';

import { StackScreenProps } from '@react-navigation/stack';

import { ProductsContext } from '../context/ProductsContext';
import { Producto } from '../interfaces/appInterfaces';
import { ProductsStackParams } from '../navigator/ProductsNavigator';
import { AuthContext } from '../context/AuthContext';

interface Props extends StackScreenProps<ProductsStackParams, 'ProductsScreen'> { }


export const ProductsScreen = ({ navigation }: Props) => {

    const { products, loadProducts } = useContext(ProductsContext)

    const { logOut } = useContext(AuthContext)

    const [refreshing, setRefreshing] = useState(false)

    const renderCard = (item: Producto) => {
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


                        <View style={{ flexDirection: 'row', paddingHorizontal: 5, }}>

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

    const loadProductsFromBackend = async () => {
        setRefreshing(true);
        await loadProducts();
        setRefreshing(false);
    }

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <View style={{flexDirection:'row'}} >
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={{ marginRight: 15, backgroundColor: '#0d1f9f', width: 60, height: 20, justifyContent: 'center', alignItems: 'center', borderRadius: 5 }}
                        onPress={() => navigation.navigate('ProductScreen', {})}
                    >
                        <Text style={{ color: 'white' }}>
                            Agregar
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={{ marginRight: 15, backgroundColor: '#0d1f9f', width: 60, height: 20, justifyContent: 'center', alignItems: 'center', borderRadius: 5 }}
                        onPress={logOut}
                    >
                        <Text style={{ color: 'white' }}>
                            logout
                        </Text>
                    </TouchableOpacity>
                </View>
            )
        })
    }, [])



    return (
        <View style={{ flex: 1, marginHorizontal: 5 }}>
            <FlatList
                data={products}
                keyExtractor={(p) => p._id}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => renderCard(item)}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={loadProductsFromBackend}
                    />
                }
            />
        </View>
    )
}

const styles = StyleSheet.create({
    productName: {
        fontSize: 20,
        color: 'white',
        textAlign: 'center',
        marginBottom: 7

    },
    itemSeparator: {
        borderBottomWidth: 1,
        marginVertical: 5,
        borderBottomColor: 'rgba(0,0,0,0.1)'
    }
})