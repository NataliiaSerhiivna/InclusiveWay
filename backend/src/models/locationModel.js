export default class LocationModel {
  async create(location) {
    console.log("Added a lcoatin " + location.name);
  }
  async getById(id) {
    console.log("Gotten location " + id);
  }
  async patch(fieldsToPatch) {}
  async delete(id) {}
  async getAll() {}
}
