from astropy.io import fits
import numpy as np
import astropy
from astropy.io import fits
import numpy as np
import matplotlib.pyplot as plt

"""
This product is based on software from the PixInsight project, developed by
Pleiades Astrophoto and its contributors (http://pixinsight.com/).
"""

class Stretch:

    def __init__(self, target_bkg=0.25, shadows_clip=-1.25):
        self.shadows_clip = shadows_clip
        self.target_bkg = target_bkg

    def _get_avg_dev(self, data):
        """Return the average deviation from the median.

        Args:
            data (np.array): array of floats, presumably the image data
        """
        median = np.median(data)
        n = data.size
        median_deviation = lambda x: abs(x - median)
        avg_dev = np.sum( median_deviation(data) / n )
        return avg_dev


    def _mtf(self, m, x):
        """Midtones Transfer Function

        MTF(m, x) = {
            0                for x == 0,
            1/2              for x == m,
            1                for x == 1,

            (m - 1)x
            --------------   otherwise.
            (2m - 1)x - m
        }

        See the section "Midtones Balance" from
        https://pixinsight.com/doc/tools/HistogramTransformation/HistogramTransformation.html

        Args:
            m (float): midtones balance parameter
                       a value below 0.5 darkens the midtones
                       a value above 0.5 lightens the midtones
            x (np.array): the data that we want to copy and transform.
        """
        shape = x.shape
        x = x.flatten()
        zeros = x==0
        halfs = x==m
        ones = x==1
        others = np.logical_xor((x==x), (zeros + halfs + ones))

        x[zeros] = 0
        x[halfs] = 0.5
        x[ones] = 1
        x[others] = (m - 1) * x[others] / ((((2 * m) - 1) * x[others]) - m)
        return x.reshape(shape)


    def _get_stretch_parameters(self, data):
        """ Get the stretch parameters automatically.
        m (float) is the midtones balance
        c0 (float) is the shadows clipping point
        c1 (float) is the highlights clipping point
        """
        median = np.median(data)
        print('median')
        print(median)
        avg_dev = self._get_avg_dev(data)
        print('avg_dev')
        print(avg_dev)
        c0 = np.clip(median + (self.shadows_clip * avg_dev), 0, 1)
        m = self._mtf(self.target_bkg, median - c0)

        return {
            "c0": c0,
            "c1": 1,
            "m": m
        }


    def stretch(self, data):
        """ Stretch the image.

        Args:
            data (np.array): the original image data array.

        Returns:
            np.array: the stretched image data
        """

        # Normalize the data
        n_max = np.max(data)
        print('n_max')
        print(n_max)
        n_index_n_max = np.argmax(data)
        row, col = np.unravel_index(n_index_n_max, data.shape)
        print('row: ')
        print(row)
        print('col: ')
        print(col)
        print('n_index_n_max')
        print(n_index_n_max)
        print('data[n_row][n_col]')
        print(data[row][col])
        
        print(np.min(data))

        d = data / n_max

        # Obtain the stretch parameters
        stretch_params = self._get_stretch_parameters(d)
        m = stretch_params["m"]
        c0 = stretch_params["c0"]
        c1 = stretch_params["c1"]
        print('m')
        print(m)
        print('c0')
        print(c0)
        print('c1')
        print(c1)

        # Selectors for pixels that lie below or above the shadows clipping point
        below = d < c0
        above = d >= c0

        # Clip everything below the shadows clipping point
        d[below] = 0

        # For the rest of the pixels: apply the midtones transfer function
        d[above] = self._mtf(m, (d[above] - c0)/(1 - c0))
        return d



# Open the FITS file
with fits.open('./localhost/files/2023-10-12T19-50-50_Coordinates_Halpha_200s_Jonas-.fts') as hdul:
 
    # Assuming the image data is in the primary HDU (0th index)
    # You can adjust the index ifimport matplotlib.pyplot as plt your data is in a different HDU
    data = hdul[0].data
 
    # Now, 'data' is a NumPy array containing the image data
    print(data.shape)  # For example, to check the shape of the array
 
# If you want to work with the data, you can continue processing it as a regular NumPy array.
 
 
 
    image = data
    print(data)
    stretched_image = Stretch().stretch(image)
    print(stretched_image)
 
 
    plt.imsave('output_image_stretched.png', stretched_image, cmap='gray')
    plt.imsave('output_image.png', data, cmap='gray')
 
