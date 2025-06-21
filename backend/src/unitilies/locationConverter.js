// Конвертація обєкту локації з бази в JSON

export default function fromDbToJSON(fullLocation) {
  const result = {
    id: fullLocation.id,
    name: fullLocation.name,
    address: fullLocation.address,
    latitude: fullLocation.latitude.toNumber(),
    longitude: fullLocation.longitude.toNumber(),
    description: fullLocation.description,
    createdBy: fullLocation.created_by,
    approved: fullLocation.approved,
    verified: fullLocation.verified,
    createdAt: fullLocation.created_at.toISOString(),
    features: fullLocation.features.map((lf) => lf.id),
    photos: fullLocation.location_photos.map(
      (lf) =>
        (lf = {
          id: lf.id,
          locationId: lf.location_id,
          imageUrl: lf.image_url,
          description: lf.description,
          uploadedAt: lf.uploaded_at.toISOString(),
        })
    ),
    comments: fullLocation.comments.map(
      (lc) =>
        (lc = {
          id: lc.id,
          locationId: lc.location_id,
          userId: lc.user_id,
          userName: lc.users.username,
          content: lc.content,
          createdAt: lc.created_at.toISOString(),
        })
    ),
  };
  return result;
}
