//Функція ковертації payload заявки на зміну локації в цілісну локацію для порівняння з поточною

export default function payloadIntoLocation(payload, location) {
  let photosToAdd;
  if (payload.photosToAdd) {
    photosToAdd = [...payload.photosToAdd];
  } else {
    photosToAdd = [];
  }
  const photos = [
    ...photosToAdd,
    ...location.photos.filter(
      (photo) => !payload.photosToDelete?.includes(photo.id)
    ),
  ];

  const newLocation = {
    ...location,
  };

  for (const key of Object.keys(payload)) {
    if ((payload[key] && key !== "photosToAdd", key !== "photosToDelete")) {
      newLocation[key] = payload[key];
    }
  }
  newLocation.photos = photos;

  return newLocation;
}
