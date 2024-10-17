import React, { useState } from 'react';
import { View, Button, Text, StyleSheet, Platform, SafeAreaView, StatusBar, ScrollView, Alert } from 'react-native';
import Roam from 'roam-reactnative';
import RNFS from 'react-native-fs';
import MapView, { Marker, Polyline } from 'react-native-maps';

const App = () => {
  const [permissionStatus, setPermissionStatus] = useState('Not requested');
  const [trackingStatus, setTrackingStatus] = useState('Not started');
  const [lastLocation, setLastLocation] = useState(null);
  const [Locations, setLocations] = useState([]);
  const [mapReady, setMapReady] = useState(false); 
  const [state, setState] = useState({
    
    pickupcords:{
      latitude:  30.7046,
      longitude:  76.7179,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    },
    droplocationcords:{
      latitude:  30.7333,
      longitude:  76.7794,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    }
  })

const {pickupcords,droplocationcords} = state

  const setupForegroundNotification = (enabled) => {
    if (Platform.OS === 'android') {
      Roam.setForegroundNotification(
        enabled,
        "Roam Example",
        "Tap to open",
        "mipmap/ic_launcher",
        "com.roamreactnativeexampleselftracking.MainActivity",
        "com.roamreactnativeexampleselftracking.LocationService"
      );
    }
  };

  const requestPermissions = () => {
    Roam.checkLocationPermission((locationStatus) => {
      if (locationStatus !== 'GRANTED') {
        Roam.requestLocationPermission();
      }

      if (Platform.OS === 'android' && Platform.Version >= 29) {
        Roam.checkBackgroundLocationPermission((backgroundStatus) => {
          if (backgroundStatus !== 'GRANTED') {
            Roam.requestBackgroundLocationPermission();
          }
          checkFinalPermissionStatus();
        });
      } else {
        checkFinalPermissionStatus();
      }
    });
  };

  const checkFinalPermissionStatus = () => {
    Roam.checkLocationPermission((locationStatus) => {
      if (Platform.OS === 'android' && Platform.Version >= 29) {
        Roam.checkBackgroundLocationPermission((backgroundStatus) => {
          setPermissionStatus(locationStatus === 'GRANTED' && backgroundStatus === 'GRANTED' ? 'Granted' : 'Denied');
        });
      } else {
        setPermissionStatus(locationStatus === 'GRANTED' ? 'Granted' : 'Denied');
      }
    });
  };

  const exportTextFile = async () => {
    const fileName = 'example.txt';
    const filePath = Platform.OS === 'ios' ? `${RNFS.DocumentDirectoryPath}/${fileName}` : `${RNFS.DownloadDirectoryPath}/${fileName}`;
    const fileContent = formatLocations();
    try {
      await RNFS.writeFile(filePath, fileContent, 'utf8');
      Alert.alert('Success', `File has been exported to: ${filePath}`);
    } catch (error) {
      console.error('Error writing file: ', error);
      Alert.alert('Error', 'Failed to write file.');
    }
  };

  const startTracking = () => {
    console.log("Starting tracking process...");
    setupForegroundNotification(true);

    Roam.checkLocationPermission((status) => {
      if (status === 'GRANTED') {
        Roam.startListener("location", (locationData) => {
          if (locationData.error) {
            console.error("Error in location listener:", locationData.error);
            setTrackingStatus('Error');
          } else {
            console.log("Location update received:", JSON.stringify(locationData));
            const parsedLocation = locationData[0];

            setLocations(prevLocations => {
              const newLocations = [
                ...prevLocations,
                {
                  latitude: parsedLocation.location.latitude,
                  longitude: parsedLocation.location.longitude,
                  // timestamp: parsedLocation.recordedAt,
                },
              ];

              console.log("Updated locations:", newLocations);
              return newLocations;
            });

            setLastLocation(parsedLocation);
          }
        });

        Roam.startTrackingDistanceInterval(10, 10, Roam.DesiredAccuracy.HIGH);
        setTrackingStatus('Started');
      } else {
        console.log("Location permission not granted. Cannot start tracking.");
        setTrackingStatus('Permission Denied');
      }
    });
  };
  const handleMapLayout = () => {
    setMapReady(true); 
  };
  const formatLocations = () => {
    return Locations.map((loc) => {
      return `Latitude: ${loc.latitude}, Longitude: ${loc.longitude}, Timestamp: ${loc.timestamp}`;
    }).join('\n');
  };

  const stopTracking = () => {
    console.log("Stopping tracking...");
    Roam.stopTracking();
    Roam.stopListener("location");
    setupForegroundNotification(false);
    setTrackingStatus('Not started');
    setLastLocation(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Roam Locations Tracker</Text>

        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>Permission Status:
            <Text style={styles.statusValue}> {permissionStatus}</Text>
          </Text>
          <Text style={styles.statusText}>Tracking Status:
            <Text style={styles.statusValue}> {trackingStatus}</Text>
          </Text>
        </View>

        {lastLocation && (
          <View style={styles.locationContainer}>
            <Text style={styles.locationTitle}>Last Received Location:</Text>
            <Text style={styles.locationText}>Latitude: {lastLocation.location.latitude.toFixed(6)}</Text>
            <Text style={styles.locationText}>Longitude: {lastLocation.location.longitude.toFixed(6)}</Text>
            <Text style={styles.locationText}>Accuracy: {lastLocation.location.accuracy.toFixed(2)} meters</Text>
            <Text style={styles.locationText}>Altitude: {lastLocation.location.altitude.toFixed(2)} meters</Text>
            <Text style={styles.locationText}>Speed: {lastLocation.location.speed} m/s</Text>
            <Text style={styles.locationText}>Activity: {lastLocation.activity}</Text>
            <Text style={styles.locationText}>Timestamp: {new Date(lastLocation.recordedAt).toLocaleString()}</Text>
            <Text style={styles.locationText}>Timezone: {lastLocation.timezone}</Text>
          </View>
        )}

        <View style={styles.buttonContainer}>
          <Button 
            title="Request Permissions" 
            onPress={requestPermissions}
            disabled={permissionStatus === 'Granted'}
          />
          <Button 
            title="Start Tracking" 
            onPress={startTracking}
            disabled={permissionStatus !== 'Granted' || trackingStatus === 'Started'}
          />
          <Button 
            title="Stop Tracking" 
            onPress={stopTracking}
            disabled={trackingStatus !== 'Started'}
          />
        </View>

        {Locations.length > 0 && (
          <View>
            <Text style={styles.title1}>{'Updated Locations:'}</Text>
            <Text style={styles.locationText}>{formatLocations()}</Text>
            <Button title="Export Text File" onPress={exportTextFile} />
          </View>
        )}
        <MapView
          style={styles.map}
          onLayout={handleMapLayout} 
          initialRegion={
      pickupcords
          }
          zoomEnabled={true}
          zoomControlEnabled={true}
          showsUserLocation={true}
        >
   {Locations.map((loc, index) => (
            <Marker
              key={index}
              coordinate={loc}
              title={`Location ${index + 1}`}
            />
          ))}
          {Locations && 
            <Polyline
          coordinates={Locations}  
          strokeColor="#FF0000"     
          strokeWidth={5}             
        />}
        </MapView>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  title1: {
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#333',
  },
  statusContainer: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statusText: {
    fontSize: 16,
    marginBottom: 10,
    color: '#666',
  },
  statusValue: {
    fontWeight: 'bold',
    color: '#333',
  },
  locationContainer: {
    backgroundColor: '#E8F5E9',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
   

    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  locationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2E7D32',
  },
  locationText: {
    fontSize: 14,
    marginBottom: 5,
    color: '#1B5E20',
  },
  buttonContainer: {
    width: '100%',
  },
  map: {
    width: '100%',
    height: 400, 
  },
});

export default App;

