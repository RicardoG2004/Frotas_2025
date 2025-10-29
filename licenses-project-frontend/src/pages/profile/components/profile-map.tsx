import { useState } from 'react'
import 'leaflet/dist/leaflet.css'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import { toast } from '@/utils/toast-utils'

function LocationMarker() {
  const [position, setPosition] = useState<[number, number] | null>(null)

  useMapEvents({
    click(e) {
      const newPosition: [number, number] = [e.latlng.lat, e.latlng.lng]
      setPosition(newPosition)
      toast.success('Localização atualizada com sucesso')
    },
  })

  return position ? <Marker position={position} /> : null
}

export default function ProfileMap() {
  const defaultPosition: [number, number] = [38.7223, -9.1393] // Lisboa

  return (
    <div className='w-full'>
      <div className='h-[400px] w-full overflow-hidden rounded-md border'>
        <MapContainer
          center={defaultPosition}
          zoom={13}
          className='h-full w-full'
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          />
          <LocationMarker />
        </MapContainer>
      </div>
    </div>
  )
}
