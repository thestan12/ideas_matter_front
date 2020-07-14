<template>
  <q-dialog
    v-model="donationDialog"
  >
    <q-card style="width: 700px; max-width: 80vw;">
      <q-card-section>
        <div class="text-h6 text-center">The idea need your support in order to see the day-light</div>
        <div class="text-h8 text-center">Donate to support the idea via<font color="blue"> PayPal</font></div>
      </q-card-section>
      <q-separator />

      <q-card-section class="q-pt-none">
        <div class="flex row col-12">
          <div class="col-2">&nbsp;</div>
          <div class="col-11">
            <q-checkbox size="md" v-model="one" val="1" label="1 $" @input="AllExlude(1)" />
          </div>
          <div class="col-1">&nbsp;</div>
          <div class="col-11">
            <q-checkbox size="md" v-model="ten" val="10" label="10 $" @input="AllExlude(10)" />
          </div>
          <div class="col-1">&nbsp;</div>
          <div class="col-11">
            <q-checkbox size="md" v-model="twenty" val="20" label="20 $" @input="AllExlude(20)"/>
          </div>
          <div class="col-1">&nbsp;</div>
          <div class="col-11">
            <q-checkbox size="md" v-model="fifty" val="50" label="50 $" @input="AllExlude(50)"/>
          </div>
          <div class="col-1">&nbsp;</div>
          <div class="col-11">
            <q-checkbox size="md" v-model="hundred" val="100" label="100 $" @input="AllExlude(100)"/>
          </div>
          <div class="col-1">&nbsp;</div>
          <div class="col-11">
            <q-checkbox size="md" v-model="thousand" val="1000" label="1000 $" @input="AllExlude(1000)"/>
          </div>
        </div>
      </q-card-section>
      <q-card-section>
        <div class="center">
          <p class="bold">Payer en utilisant</p>
            <div ref="paypal" class="margin-left"></div>
        </div>
      </q-card-section>
      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="Cancel" color="red" v-close-popup @click="submitDonation"/>
        <q-btn flat label="Validate" color = "green" @click="submitDonation" v-close-popup/>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'donation',
  props:["donationDialog"],
  data() {
    return {
      donationInfo: "",
      shape: [ 'line' ],
      one: false,
      ten: true,
      twenty: false,
      fifty: false,
      hundred: false,
      thousand: false,
      product: {
        price: 10,
        description: "Donation to ideasMatter"
      }
    }
  },
  methods: {
    setLoaded() {
      this.loaded = true;
      window.paypal
        .Buttons({
          createOrder: (data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  description: this.product.description,
                  amount: {
                    currency_code: "USD",
                    value: this.product.price
                  }
                }
              ]
            });
          },
          onApprove: async (data, actions) => {
            const order = await actions.order.capture();
            this.data;
            this.paidFor = true;
            console.log(order);
          },
          onError: err => {
            console.log(err);
          }
        })
        .render(this.$refs.paypal);
    },
    submitDonation() {
      this.$emit('submitDonation', this.donationInfo);
      this.editorComment = "Type your comment here !";
    },
    AllExlude(value) {
      switch (value) {
        case 1:
          this.one = true;
          this.ten = false;
          this.twenty = false;
          this.fifty = false;
          this.hundred = false;
          this.thousand = false;
          this.product.price = 1;
          break;
        case 10:
          this.one = false;
          this.ten = true;
          this.twenty = false;
          this.fifty = false;
          this.hundred = false;
          this.thousand = false;
          this.product.price = 10;
          break;
        case 20:
          this.one = false;
          this.ten = false;
          this.twenty = true;
          this.fifty = false;
          this.hundred = false;
          this.thousand = false;
          this.product.price = 20;
          break;
        case 50:
          this.one = false;
          this.ten = false;
          this.twenty = false;
          this.fifty = true;
          this.hundred = false;
          this.thousand = false;
          this.product.price = 50;
          break;
        case 100:
          this.one = false;
          this.ten = false;
          this.twenty = false;
          this.fifty = false;
          this.hundred = true;
          this.thousand = false;
          this.product.price = 100;
          break;
        case 1000:
          this.one = false;
          this.ten = false;
          this.twenty = false;
          this.fifty = false;
          this.hundred = false;
          this.thousand = true;
          this.product.price = 1000;
          break;
        default:

      }
    }
  },
  computed: {

  },
  mounted() {
    console.log('this.donationDialog = ', this.donationDialog);
    if (this.donationDialog) {

    }
  },
  watch: {
    product(newv, oldv) {
      this.setLoaded();
    },
    donationDialog(newv, oldv) {
      if (newv === true) {
        console.log('dans le mountedddddddddd ');
        const script = document.createElement("script");
        script.src =
        "https://www.paypal.com/sdk/js?client-id=AdSlFoA8xUFJAIPylsQp6z24nXBEVFSW8-dBIgHPZ6vL4_dqj3qjjQegzYI4W6kXT8IKXp0p19WmE7Gb";
        script.addEventListener("load", this.setLoaded);
        document.body.appendChild(script);
      }
    }
  },
}

</script>
