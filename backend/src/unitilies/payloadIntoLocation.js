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
const payload = {};
const location = {
  name: "Central Park",
  address: "New York, NY, USA",
  latitude: 40.785091,
  longitude: -73.968285,
  description: "A large public park in the middle of Manhattan.",
  approved: true,
  verified: false,
  createdAt: "2025-05-28T10:00:00.000Z",
  features: [1, 2, 3],
  photos: [
    {
      imageUrl: "https://example.com/photo1.jpg",
      description: "Main entrance of Central Park",
      uploadedAt: "2025-05-28T11:00:00.000Z",
      id: 1,
      locationId: 1,
    },
    {
      imageUrl: "https://example.com/photo1.jpg",
      description: "A beautiful view of the lake and trees in Central Park.",
      uploadedAt: "2023-10-15T14:30:00.000Z",
      id: 5,
      locationId: 1,
    },
    {
      imageUrl: "https://example.com/photo2.jpg",
      description: "The Bethesda Fountain on a sunny afternoon.",
      uploadedAt: "2023-10-16T10:00:00.000Z",
      id: 6,
      locationId: 1,
    },
    {
      imageUrl: "https://example.com/photo1.jpg",
      description: "A beautiful view of the lake and trees in Central Park.",
      uploadedAt: "2023-10-15T14:30:00.000Z",
      id: 7,
      locationId: 1,
    },
    {
      imageUrl: "https://example.com/photo2.jpg",
      description: "The Bethesda Fountain on a sunny afternoon.",
      uploadedAt: "2023-10-16T10:00:00.000Z",
      id: 8,
      locationId: 1,
    },
  ],
  id: 1,
  createdBy: 2,
  comments: [],
};
//console.log(payloadIntoLocation(payload, location));
