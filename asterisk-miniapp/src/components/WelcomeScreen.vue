<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { useTelegramStore } from '../stores/telegram'

const userStore = useUserStore()
const telegramStore = useTelegramStore()

const router = useRouter()
const showContent = ref(false)
const tgHandle = ref('');
const loading = ref(false)

onMounted(() => {
  tgHandle.value = telegramStore.userInfo?.username || ''
  setTimeout(() => {
    showContent.value = true
  }, 100)
})

const handleContinue = async () => {
  try {
    loading.value = true
    const telegramId = telegramStore.userInfo?.id
    if (!telegramId) {
      throw new Error('No Telegram ID found')
    }

    
    
    // Create initial user
    await userStore.createUser(telegramId)
    
    // Set first login flag
    userStore.isFirstLogin = true
    
    // Navigate to verify
    // if user is verified, navigate to profile
    if (await userStore.checkGenderVerification(telegramId)) {
      router.push('/profile')
    } else {
      router.push('/verify')
    }
  } catch (error) {
    console.error('Failed to create initial user:', error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="welcome-screen screen-container" :class="{ 'show': showContent }">
    <h1 class="title">Hi!</h1>
    <p class="subtitle">Please confirm whether your profile information is displayed correctly.</p>

    <div class="welcome-content">
      <div class="asterisk-logo"><img src="../assets/asterisk-pink.gif" alt="*" /></div>
      
      <div v-if="userStore.userData?.nickname" class="nickname">
        <label>Nickname</label>
        <span>{{ userStore.userData?.nickname }}</span>
      </div>
      
      <div v-if="telegramStore.userInfo?.username" class="nickname">
        <label>Telegram Handle</label>
        <span class="handle">@{{ tgHandle }}</span>
      </div>
      <div v-else class="nickname">
        <label>Telegram Handle</label>
        <span>No handle available. There could be an issue with your Telegram account's privacy settings.</span>
        <span>This is not a problem, you can still use the app. For troubleshooting, try setting a username, or updating your privacy settings.</span>
      </div>
    </div>
    

    <div class="actions">
      <button class="button primary" @click="handleContinue">
        Yes, this is correct
      </button>
    </div>
  </div>
</template>

<style scoped>
.welcome-screen {
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.5s ease;
}

.welcome-screen.show {
  opacity: 1;
  transform: translateY(0);
}

.welcome-content {
  margin: 32px 0;
  text-align: center;
  opacity: 0;
  animation: fadeIn 0.5s ease forwards 0.5s;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

.asterisk-logo {
  font-size: 32px;
  color: var(--primary);
}

.asterisk-logo img {
  width: 100px;
}

.nickname {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.nickname label {
  font-weight: 500;
  color: var(--text);
}

.nickname span {
  color: var(--primary);
  font-size: 18px;
}

.actions {
  margin-top: auto;
  opacity: 0;
  animation: fadeIn 0.5s ease forwards 0.7s;
}

@keyframes fadeIn {
  to {
    opacity: 1;
  }
}
</style> 