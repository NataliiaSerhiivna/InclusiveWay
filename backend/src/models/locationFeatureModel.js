export default class LocationFeatureModel {
  async create(locationFeature) {
    console.log("Added a lcoatin-feature pair ");
  }
  async getById(id) {
    console.log("Gotten location-feature pair " + id);
  }
  async patch(fieldsToPatch) {}
  async delete(id) {}
  async getAll() {}
}
