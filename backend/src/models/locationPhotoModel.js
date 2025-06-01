export default class LocationPhotoModel {
  async create(locationPhoto) {
    console.log("Added a lcoatin photo ");
  }
  async getById(id) {
    console.log("Gotten a location photo " + id);
  }
  async patch(fieldsToPatch) {}
  async delete(id) {}
  async getAll() {}
}
