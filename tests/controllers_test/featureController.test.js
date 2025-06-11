

import { getFeatures } from '../../src/controllers/featureController.js';
import FeatureModel from '../../src/models/featureModel.js';


jest.mock('../../src/models/featureModel.js');

describe('getFeatures', () => {
  let req, res;
  let mockFeatureModel;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };

    mockFeatureModel = {
      getFeatures: jest.fn()
    };

    FeatureModel.mockImplementation(() => mockFeatureModel);
    jest.clearAllMocks();
  });

  it('повертає список фіч з кодом 200', async () => {
    const mockFeatures = [
      { id: 1, name: 'Ramp' },
      { id: 2, name: 'Elevator' }
    ];

    mockFeatureModel.getFeatures.mockResolvedValue(mockFeatures);

    await getFeatures(req, res);

    expect(mockFeatureModel.getFeatures).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith(mockFeatures);
  });

  it('обробляє помилку та повертає 500', async () => {
    const error = new Error('DB error');
    mockFeatureModel.getFeatures.mockRejectedValue(error);

    await getFeatures(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith(error.message);
  });
});
