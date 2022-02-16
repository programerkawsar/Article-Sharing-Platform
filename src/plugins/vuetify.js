import Vue from 'vue';
// import vuetify liberty
import Vuetify from 'vuetify/lib';
// import vuetify colors liberty
import colors from 'vuetify/lib/util/colors'

Vue.use(Vuetify); // use Vuetify

// vuetify dark/light mode
export default new Vuetify({
    theme: {
        themes: {
          dark: {
            error: colors.white,
          },
        },
    },
});
