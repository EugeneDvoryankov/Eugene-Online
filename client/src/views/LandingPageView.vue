<script lang="ts">
import DICELogo from '@/components/icons/DICELogo.vue';
import EmbarkStudiosLogo from '@/components/icons/EmbarkStudiosLogo.vue';
import GithubLogo from '@/components/icons/GithubLogo.vue';
import GitlabLogo from '@/components/icons/GitlabLogo.vue';
import IKEALogo from '@/components/icons/IKEALogo.vue';
import IZettleLogo from '@/components/icons/IZettleLogo.vue';
import KingLogo from '@/components/icons/KingLogo.vue';
import LandingPageDrawing from '@/components/icons/LandingPageDrawing.vue';
import LandingPageTeamDrawing from '@/components/icons/LandingPageTeamDrawing.vue';
import MicrosoftLogo from '@/components/icons/MicrosoftLogo.vue';
import TruecallerLogo from '@/components/icons/TruecallerLogo.vue';
import VolvoLogo from '@/components/icons/VolvoLogo.vue';
import { BButton, BContainer } from 'bootstrap-vue-next';

export default {
  components: {
    BContainer,
    BButton,
    LandingPageDrawing,
    GithubLogo,
    MicrosoftLogo,
    GitlabLogo,
    VolvoLogo,
    EmbarkStudiosLogo,
    DICELogo,
    KingLogo,
    TruecallerLogo,
    IKEALogo,
    IZettleLogo,
    LandingPageTeamDrawing,
  },
};
</script>

<template>
  <!-- <h1>Landing Page</h1> -->
  <!-- Page container -->
  <BContainer fluid="md" class="py-5 overflow-x-hidden">
    <!-- Container with call-to-action and drawing -->
    <BContainer fluid tag="section" class="vh-70 d-flex flex-column flex-md-row">
      <div class="order-2 order-md-1 flex-1 d-flex flex-column justify-content-center gap-3">
        <h1>Vi löser det <span class="fst-italic">tråkiga</span> tekniska</h1>
        <h3 class="fs-4 text-secondary">Sveriges största konsultbolag specialiserad inom allting IT vill jobba med dig, liten som stor</h3>
        <div class="d-flex flex-row gap-3 mt-4">
          <BButton variant="light" size="lg" to="/products">Våra tjänster</BButton>
          <BButton variant="primary" size="lg" to="/register">Registrera dig</BButton>
        </div>
      </div>
      <div class="order-1 order-md-2 position-relative flex-1 d-flex justify-content-center align-items-center">
        <!-- Quotes from clients around the drawing -->
        <!-- Replaced with icons -->
        <!-- <span class="d-none d-md-block position-absolute top-50 left-80 fs-6 fst-italic text-secondary">"Pålitliga"</span>
        <span class="d-none d-md-block position-absolute top-40 left-10 fs-6 fst-italic text-secondary">"Kompetent"</span>
        <span class="d-none d-md-block position-absolute top-70 left-70 fs-6 fst-italic text-secondary">"Professionell service"</span>
        <span class="d-none d-md-block position-absolute top-80 left-20 fs-6 fst-italic text-secondary">"...vet inte vad jag gjort utan dom"</span>
        <span class="d-none d-md-block position-absolute top-20 left-20 fs-6 fst-italic text-secondary">"...tydligt och prisvärt"</span>
        <span class="d-none d-md-block position-absolute top-20 left-70 fs-6 fst-italic text-secondary">"Hjälpte mig som nystartad"</span> -->
        <!-- <i class="bi bi-braces"></i> -->
        <LandingPageDrawing class="w-50" />
      </div>
    </BContainer>

    <!-- Container with company references -->
    <BContainer fluid class="d-flex flex-row overflow-hidden">
      <!-- Row -->
      <div class="reference-company-row d-flex flex-basis-100">
        <!-- First segment -->
        <div class="reference-company">
          <GithubLogo class="w-100" />
        </div>
        <div class="reference-company">
          <MicrosoftLogo class="w-100" />
        </div>
        <div class="reference-company">
          <EmbarkStudiosLogo class="w-100" />
        </div>
        <div class="reference-company">
          <GitlabLogo class="w-100" />
        </div>
        <div class="reference-company">
          <VolvoLogo class="w-100" />
        </div>
        <!-- Second segment -->
        <div class="reference-company">
          <KingLogo class="w-50" />
        </div>
        <div class="reference-company">
          <DICELogo class="w-100" />
        </div>
        <div class="reference-company">
          <TruecallerLogo class="w-100" />
        </div>
        <div class="reference-company">
          <IKEALogo class="w-75" />
        </div>
        <div class="reference-company">
          <IZettleLogo class="w-100" />
        </div>
      </div>

      <!-- Replacement row -->
      <div class="reference-company-row-replacement d-flex flex-basis-100">
        <!-- First segment -->
        <div class="reference-company">
          <GithubLogo class="w-100" />
        </div>
        <div class="reference-company">
          <MicrosoftLogo class="w-100" />
        </div>
        <div class="reference-company">
          <EmbarkStudiosLogo class="w-100" />
        </div>
        <div class="reference-company">
          <GitlabLogo class="w-100" />
        </div>
        <div class="reference-company">
          <VolvoLogo class="w-100" />
        </div>
        <!-- Second segment -->
        <div class="reference-company">
          <KingLogo class="w-50" />
        </div>
        <div class="reference-company">
          <DICELogo class="w-100" />
        </div>
        <div class="reference-company">
          <TruecallerLogo class="w-100" />
        </div>
        <div class="reference-company">
          <IKEALogo class="w-75" />
        </div>
        <div class="reference-company">
          <IZettleLogo class="w-100" />
        </div>
      </div>
    </BContainer>

    <BContainer fluid tag="section">
      <div class="w-100 d-flex flex-column flex-md-row gap-4">
        <div class="flex-basis-50 d-flex flex-column justify-content-end gap-2 px-5 py-4 bg-primary rounded-4 text-white">
          <h3>Kom igång. <span class="separate-line">Börja med ett företagskonto.</span></h3>
          <BButton variant="outline-primary" class="text-light border-light max-w-50" to="/register">Skapa konto</BButton>
        </div>
        <!-- Avatars from https://notion-avatar.app/ -->
        <div class="flex-basis-50 d-flex flex-column gap-2 px-4 py-4 bg-primary rounded-4 text-white">
          <div class="w-100 d-flex justify-content-center align-items-center bg-white rounded-4">
            <LandingPageTeamDrawing style="height: 120px" />
          </div>
          <RouterLink to="/about-us" class="d-flex align-items-center gap-2 text-white">
            <h3>Möt teamet</h3>
            <i class="bi bi-arrow-up-right"></i>
          </RouterLink>
          <!-- <span>Vi är ett senior team med bakgrund inom systemutveckling, arkitektur och IT-ledning från olika branscher.</span> -->
        </div>
        <!-- <div class="employee-columns d-none d-sm-block">
            <BRow class="flex-nowrap">
              <BCol>
                <div class="employee-card rounded-3 d-flex align-items-stretch gap-1">
                  <div class="d-flex flex-column">
                    <span class="text-nowrap">Sven Svensson</span>
                    <span class="fw-bold text-nowrap">iOS Utvecklare</span>
                  </div>
                </div>
              </BCol>

              <BCol>
                <div class="employee-card rounded-3 d-flex align-items-stretch gap-1">
                  <div class="d-flex flex-column">
                    <span class="text-nowrap">Anna Johansson</span>
                    <span class="fw-bold text-nowrap">Webbutvecklare</span>
                  </div>
                </div>
              </BCol>
            </BRow>

            <BRow class="flex-nowrap">
              <BCol>
                <div class="employee-card rounded-3 d-flex align-items-stretch gap-1">
                  <div class="d-flex flex-column">
                    <span class="text-nowrap">Bengt Bengtsson</span>
                    <span class="fw-bold text-nowrap">DevOps</span>
                  </div>
                </div>
              </BCol>

              <BCol>
                <div class="employee-card rounded-3 d-flex align-items-stretch gap-1">
                  <div class="d-flex flex-column">
                    <span class="text-nowrap">Peter Petersson</span>
                    <span class="fw-bold text-nowrap">QA Testare</span>
                  </div>
                </div>
              </BCol>
            </BRow>

            <BRow class="flex-nowrap">
              <BCol>
                <div class="employee-card rounded-3 d-flex align-items-stretch gap-1">
                  <div class="d-flex flex-column">
                    <span class="text-nowrap">Olof Olofsson</span>
                    <span class="fw-bold text-nowrap">Brand Manager</span>
                  </div>
                </div>
              </BCol>

              <BCol>
                <div class="employee-card rounded-3 d-flex align-items-stretch gap-1">
                  <div class="d-flex flex-column">
                    <span class="text-nowrap">Karl Karlsson</span>
                    <span class="fw-bold text-nowrap">UX Designer</span>
                  </div>
                </div>
              </BCol>
            </BRow>
          </div> -->
      </div>
    </BContainer>
  </BContainer>
</template>

<style scoped>
  .reference-company {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-basis: 20%;
    flex-shrink: 0;
    padding: 0.4rem;
  }

  /* Bootstrap md */
  @media (min-width: 768px) {
    .reference-company {
      padding: 1rem;
    }
  }

  /* Bootstrap lg */
  @media (min-width: 992px) {
    .reference-company {
      padding: 2rem;
    }
  }

  .reference-company-row {
    animation: slideLeft 24s linear infinite;
  }

  .reference-company-row-replacement {
    animation: slideLeftReplacement 24s linear infinite;
  }

  @keyframes slideLeft {
    from {
      transform: translate(0%, 0%);
    }
    to {
      transform: translate(-200%, 0%);
    }
  }

  /* When the row has animated all the way to the left */
  /* the container will be empty so you have to animate in a copy */
  /* So that when the next animation iteration starts you start from */
  /* the first five logos you started with the first time */
  @keyframes slideLeftReplacement {
    from {
      transform: translate(100%, 0%);
    }
    to {
      transform: translate(-100%, 0%);
    }
  }

  .employee-columns {
    position: absolute;
    top: -25%;
    left: 0;
    bottom: 0;
    right: 5%;
  }

  .employee-card {
    padding-top: 0.25rem;
    padding-bottom: 0.25rem;
    padding-left: 1.5rem;
    padding-right: 1.5rem;
    background-color: white;
    color: black;
    margin-top: 0.75rem;
    -webkit-box-shadow: 0px 8px 16px 0px rgba(66, 68, 90, 0.5);
    -moz-box-shadow: 0px 8px 16px 0px rgba(66, 68, 90, 0.5);
    box-shadow: 0px 8px 16px 0px rgba(66, 68, 90, 0.5);
  }

  .employee-card-1 {
    top: -30%;
    left: 0;
  }

  .card-shadow {
    -webkit-box-shadow: 0px 8px 16px 0px rgba(66, 68, 90, 0.5);
    -moz-box-shadow: 0px 8px 16px 0px rgba(66, 68, 90, 0.5);
    box-shadow: 0px 8px 16px 0px rgba(66, 68, 90, 0.5);
  }

  .vh-70 {
    height: 70vh;
  }

  .vh-80 {
    height: 80vh;
  }

  .no-shrink {
    flex-shrink: 0;
    min-width: 0;
  }

  .flex-1 {
    flex: 1;
    /* Flex shrink below content size */
    min-width: 0;
    min-height: 0;
  }

  .flex-basis-40 {
    flex-basis: 40%;
    flex-shrink: 0;
    flex-grow: 0;
  }

  .flex-basis-50 {
    flex-basis: 50%;
    flex-shrink: 0;
    flex-grow: 0;
  }

  .flex-basis-60 {
    flex-basis: 60%;
    flex-shrink: 0;
    flex-grow: 0;
  }

  .flex-basis-100 {
    flex-basis: 100%;
    flex-shrink: 0;
    flex-grow: 0;
  }

  .separate-line {
    display: block;
  }

  .off-primary {
    color: #000000;
  }

  .top-10 {
    top: 10%;
  }

  .top-20 {
    top: 20%;
  }

  .top-30 {
    top: 30%;
  }

  .top-40 {
    top: 40%;
  }

  .top-60 {
    top: 60%;
  }

  .top-70 {
    top: 70%;
  }

  .top-80 {
    top: 80%;
  }

  .top-90 {
    top: 90%;
  }

  .left-10 {
    left: 10%;
  }

  .left-20 {
    left: 20%;
  }

  .left-30 {
    left: 30%;
  }

  .left-40 {
    left: 40%;
  }

  .left-60 {
    left: 60%;
  }

  .left-70 {
    left: 70%;
  }

  .left-80 {
    left: 80%;
  }

  .left-90 {
    left: 10%;
  }
</style>
