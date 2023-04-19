import { useEffect, useContext, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View, TouchableOpacity, Image } from 'react-native';

import { Picker } from '@react-native-picker/picker';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { StackScreenProps } from '@react-navigation/stack';

import { ProductsStackParams } from '../navigator/ProductsNavigator';
import { useCategories } from '../hooks/useCategories';
import { useForm } from '../hooks/useForm';
import { ProductsContext } from '../context/ProductsContext';

interface Props extends StackScreenProps<ProductsStackParams, 'ProductScreen'> { };


export const ProductScreen = ({ navigation, route }: Props) => {

  const { loadProductById, addProducts, updateProduct, deleteProduct, uploadImage } = useContext(ProductsContext)

  const { id = '', name = '' } = route.params;

  const [tempUri, setTempUri] = useState<string>('');

  const { categories } = useCategories();

  const { _id, categoriaId, nombre, img, onChange, setFormValue } = useForm({
    _id: id,
    categoriaId: '',
    nombre: name,
    img: ''
  });


  useEffect(() => {
    navigation.setOptions({
      title: (!nombre) ? ' Nuevo Producto ' : nombre
    })

  }, [nombre]);

  useEffect(() => {
    loadProduct()
  }, [])

  const loadProduct = async () => {

    if (id.length === 0) return;
    const product = await loadProductById(id);

    setFormValue({
      _id: id,
      categoriaId: product.categoria._id,
      img: product.img || '',
      nombre,
    })
  }

  const saveOrUpdate = async () => {
    if (id.length > 0) {
      updateProduct(categoriaId, nombre, id);
    } else {

      const tempCategoriaId = categoriaId || categories[0]._id;
      const newProduct = await addProducts(tempCategoriaId, nombre);
      onChange(newProduct._id, '_id')
    }
  }

  const deleteProductScreen = async () => {
    if (id.length > 0) {
      await deleteProduct(id)
      navigation.goBack()
    }
  }

  const takePhoto = () => {

    launchCamera({
      mediaType: 'photo',
      quality: 0.5
    }, (resp) => {
      if (resp.didCancel) return;

      if (!resp.assets![0].uri) return;

      setTempUri(resp.assets![0].uri);
      uploadImage(resp, _id);
    })
  }

  const takePhotoFromGallery = () => {

    launchImageLibrary({
      mediaType: 'photo',
      quality: 0.5
    }, (resp) => {
      if (resp.didCancel) return;

      if (!resp.assets![0].uri) return;

      setTempUri(resp.assets![0].uri);
      uploadImage(resp, _id);
    })
  }


  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.label} >Nombre del Producto</Text>
        <TextInput
          style={styles.textInput}
          placeholder='Producto'
          placeholderTextColor='rgba(0,0,0,0.4)'
          value={nombre}
          onChangeText={(value) => onChange(value, 'nombre')}
        />

        {/* picker */}
        <Text style={styles.categoria} >
          Categoria:
        </Text>

        <Picker
          mode='dropdown'
          // prompt='Selecciona tu lenguaje '
          dropdownIconColor='black'
          // dropdownIconRippleColor='yellow'
          // numberOfLines={4}
          // onBlur={() => console.log('hola')}
          // onFocus={() => console.log('hola')}
          // itemStyle={{borderBottomColor: 'red'}}
          selectedValue={categoriaId}
          onValueChange={(value) => onChange(value, 'categoriaId')}>

          {
            categories.map(c => (
              <Picker.Item
                style={{ backgroundColor: 'white', color: 'black' }}
                key={c._id}
                label={c.nombre}
                value={c._id}
              />
            ))
          }

        </Picker>

        {/* Buttom save  */}
        <View style={styles.colorButtonSave}>
          <TouchableOpacity
            style={styles.buttonSave}
            activeOpacity={0.8}
            onPress={saveOrUpdate}
          >
            <Text>
              Guardar
            </Text>
          </TouchableOpacity>
        </View>
        {

        }
        <View style={styles.colorButtonSave}>
          <TouchableOpacity
            style={styles.buttonSave}
            activeOpacity={0.8}
            onPress={deleteProductScreen}
          >
            <Text>
              delete
            </Text>
          </TouchableOpacity>
        </View>

        {/* dos botones */}

        {
          (_id.length > 0) && (
            <View style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>

              <View style={styles.colorButtonSave}>
                <TouchableOpacity
                  style={styles.buttonSave}
                  activeOpacity={0.8}
                  onPress={takePhoto}
                >
                  <Text>
                    Cámara
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.colorButtonSave}>
                <TouchableOpacity
                  style={styles.buttonSave}
                  activeOpacity={0.8}
                  onPress={takePhotoFromGallery}
                >
                  <Text>
                    Galeria
                  </Text>
                </TouchableOpacity>
              </View>

            </View>
          )
        }


        {
          (img.length > 0 && !tempUri) && (
            <Image
              source={{ uri: img }}
              style={{
                marginTop: 20,
                width: '100%',
                height: 300,
                borderRadius: 4,
              }}
            />
          )
        }

        {
          (tempUri) && (
            <Image
              source={{ uri: tempUri }}
              style={{
                marginTop: 20,
                width: '100%',
                height: 300,
                borderRadius: 4,
              }}
            />
          )
        }



      </ScrollView>
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
    marginHorizontal: 20,
  },
  label: {
    fontSize: 19,
    color: 'black'
  },
  textInput: {
    fontSize: 17,
    color: 'black',
    borderWidth: 1,
    marginTop: 10,
    marginBottom: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderColor: 'rgba(0,0,0,0.2)',
    height: 45,
  },
  categoria: {

  },
  colorButtonSave: {
    backgroundColor: '#5856D6',
    width: 100,
    // height: 30,
    marginTop: 8,
    paddingHorizontal: 5,
    paddingVertical: 5,
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 5,
    marginHorizontal: 5
  },
  buttonSave: {
    justifyContent: 'center',
    alignItems: 'center',

  }
})