import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader } from '@googlemaps/js-api-loader';
import { Candidate } from '../../types/database.types';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Card } from '../ui/Card';
import Button from '../ui/Button';

interface CandidatesMapProps {
  candidates: Candidate[];
}

interface GeocodedCandidate extends Candidate {
  lat?: number;
  lng?: number;
}

const CandidatesMap: React.FC<CandidatesMapProps> = ({ candidates }) => {
  const navigate = useNavigate();
  const mapRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [geocodedCount, setGeocodedCount] = useState(0);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);

  useEffect(() => {
    const initMap = async () => {
      try {
        const loader = new Loader({
          apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
          version: "weekly",
          libraries: ["places", "geometry"]
        });

        const google = await loader.load();
        const { Map, Geocoder, InfoWindow } = google.maps;

        if (!mapRef.current) return;

        const map = new Map(mapRef.current, {
          center: { lat: 37.0902, lng: -95.7129 }, // US center
          zoom: 4,
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }]
            }
          ]
        });

        const bounds = new google.maps.LatLngBounds();
        const geocoder = new Geocoder();
        infoWindowRef.current = new InfoWindow();

        // Clear existing markers
        markersRef.current.forEach(marker => marker.setMap(null));
        markersRef.current = [];

        // Only geocode candidates with locations
        const candidatesWithLocations = candidates.filter(c => c.location);
        let geocodedCount = 0;

        for (const candidate of candidatesWithLocations) {
          try {
            const results = await geocoder.geocode({ address: candidate.location });
            
            if (results.results?.[0]?.geometry?.location) {
              const location = results.results[0].geometry.location;
              
              const marker = new google.maps.Marker({
                position: location,
                map,
                title: candidate.name,
                animation: google.maps.Animation.DROP
              });

              const content = `
                <div class="p-2 min-w-[200px]">
                  <h3 class="font-medium text-gray-900">${candidate.name}</h3>
                  ${candidate.current_title ? 
                    `<p class="text-sm text-gray-600">${candidate.current_title}</p>` : ''}
                  <p class="text-sm text-gray-500">${candidate.location}</p>
                </div>
              `;

              marker.addListener("click", () => {
                navigate(`/candidates/${candidate.id}`);
              });

              marker.addListener("mouseover", () => {
                if (infoWindowRef.current) {
                  infoWindowRef.current.setContent(content);
                  infoWindowRef.current.open(map, marker);
                }
              });

              marker.addListener("mouseout", () => {
                if (infoWindowRef.current) {
                  infoWindowRef.current.close();
                }
              });

              markersRef.current.push(marker);
              bounds.extend(location);
              geocodedCount++;
              setGeocodedCount(geocodedCount);
            }
          } catch (error) {
            console.warn(`Failed to geocode location for candidate: ${candidate.name}`, error);
          }
        }

        // Only adjust bounds if we have markers
        if (!bounds.isEmpty()) {
          map.fitBounds(bounds);
          // Zoom out slightly for better context
          map.setZoom(map.getZoom() - 1);
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing map:', error);
        setError('Failed to load Google Maps. Please check your API key and try again.');
        setIsLoading(false);
      }
    };

    initMap();

    return () => {
      // Cleanup markers
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];
      
      // Close info window
      if (infoWindowRef.current) {
        infoWindowRef.current.close();
      }
    };
  }, [candidates, navigate]);

  if (error) {
    return (
      <Card>
        <div className="p-8 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to Load Map</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button 
            variant="outline" 
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Candidate Locations</h3>
            <p className="text-sm text-gray-500">
              {candidates.filter(c => c.location).length} candidates with location data
            </p>
          </div>
          {!isLoading && (
            <p className="text-sm text-gray-500">
              Showing {geocodedCount} mapped locations
            </p>
          )}
        </div>
      </div>

      <div className="relative w-full h-[calc(100vh-16rem)] rounded-lg overflow-hidden shadow-lg bg-white">
        {isLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
              <span className="text-gray-600">Loading map...</span>
            </div>
          </div>
        )}
        <div ref={mapRef} className="w-full h-full" />
      </div>
    </div>
  );
};

export default CandidatesMap;