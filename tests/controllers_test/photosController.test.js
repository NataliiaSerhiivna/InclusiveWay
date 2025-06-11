import { deleteLocationPhoto } from '../../src/controllers/photosController.js';
import LocationPhotoModel from '../../src/models/locationPhotoModel.js';

jest.mock('../../src/models/locationPhotoModel.js');

describe('deleteLocationPhoto', () => {
  let req, res, locationPhotoModelInstance;

  beforeEach(() => {
    req = { params: { id: '123' } }; // id - рядок

    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    locationPhotoModelInstance = {
      delete: jest.fn(),
    };

    LocationPhotoModel.mockImplementation(() => locationPhotoModelInstance);
  });

  it('should delete location photo and return 200 status', async () => {
    locationPhotoModelInstance.delete.mockResolvedValue();

    await deleteLocationPhoto(req, res);

    expect(locationPhotoModelInstance.delete).toHaveBeenCalledWith(123);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith();
  });

  it('should handle errors and return 500 status', async () => {
    const error = new Error('some error message');
    locationPhotoModelInstance.delete.mockRejectedValue(error);

    await deleteLocationPhoto(req, res);

    expect(locationPhotoModelInstance.delete).toHaveBeenCalledWith(123);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith('some error message');
  });
});
