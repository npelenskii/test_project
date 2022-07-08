import React, { useState, useEffect, useCallback } from "react";
import { DirectionsRenderer, GoogleMap, Marker } from "@react-google-maps/api";

function Map(props) {
    const [markerPosition, setMarkerPosition] = useState(null);
    const [mapProps, setMapsProps] = useState({
        zoom: 10,
        center: { lat: 50.450089, lng: 30.524188 },
    });
    const [direction, setDirection] = useState({ response: null });

    useEffect(() => {
        if (markerPosition && props.shop) {
            const directionsService =
                new window.google.maps.DirectionsService();
            const origin = props.shop.address;
            const destination = markerPosition;

            directionsService.route(
                {
                    origin: origin,
                    destination: destination,
                    travelMode: window.google.maps.TravelMode.DRIVING,
                },
                (result, status) => {
                    if (status === window.google.maps.DirectionsStatus.OK) {
                        setDirection({
                            response: result,
                        });
                    } else {
                        console.error(`error fetching directions ${result}`);
                    }
                }
            );
        }
    }, [markerPosition]);

    const MapClick = useCallback((event) => {
        const coordinates = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng(),
        };
        setMarkerPosition(coordinates);
        props.mapClick(coordinates);
        setMapsProps({
            zoom: 15,
            center: coordinates,
        });
    });

    console.log(props);

    return (
        <GoogleMap
            zoom={mapProps.zoom}
            center={mapProps.center}
            mapContainerClassName="map-container"
            onClick={MapClick}
        >
            {props.shop !== null && (
                <Marker position={props.shop.coordinates} />
            )}
            {markerPosition && <Marker position={markerPosition} />}

            {markerPosition && props.shop !== null && direction.response && (
                <DirectionsRenderer
                    options={{
                        directions: direction.response,
                    }}
                />
            )}
        </GoogleMap>
    );
}

export default Map;
