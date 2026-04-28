// app/(tabs)/index.tsx

import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { FlatList, Image, KeyboardAvoidingView, Modal, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { CHAT_DATA } from '../../constants/mockData'; // 請確保路徑正確

export default function App() {
  const [activeTab, setActiveTab] = useState('chats');
  const [selectedChat, setSelectedChat] = useState(null);
  const [profileImage, setProfileImage] = useState(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, aspect: [1, 1], quality: 1,
    });
    if (!result.canceled) setProfileImage(result.assets[0].uri);
  };

  // --- 便利貼氣泡組件 ---
  const StatusNoteBubble = ({ text }: { text?: string }) => {
    if (!text) return null;
    return (
      <View style={styles.noteContainer}>
        <View style={styles.noteBubble}>
          <Text style={styles.noteText} numberOfLines={2}>{text}</Text>
        </View>
        {/* 氣泡小尾巴 */}
        <View style={styles.noteTail} />
      </View>
    );
  };

  // --- 橫向狀態列 (頭像一個個排好) ---
  const HorizontalStatusSection = () => (
    <View style={styles.statusSection}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.statusScroll}>
        {/* 我的狀態 (含 ImagePicker 測試) */}
        <View style={styles.statusItem}>
          <View style={styles.avatarWrapper}>
             <View style={styles.addNoteBadge}><Ionicons name="add" size={16} color="white" /></View>
             {profileImage ? (
               <Image source={{ uri: profileImage }} style={styles.statusAvatar} />
             ) : (
               <View style={[styles.statusAvatar, { backgroundColor: '#eee' }]}>
                 <Ionicons name="person" size={30} color="#ccc" />
               </View>
             )}
          </View>
          <Text style={styles.statusNameLabel}>你的便利貼</Text>
        </View>

        {/* 聯絡人的橫向狀態 */}
        {CHAT_DATA.map((item) => (
          <TouchableOpacity key={item.id} style={styles.statusItem} onPress={() => setSelectedChat(item)}>
            <View style={styles.avatarWrapper}>
              {item.note && <StatusNoteBubble text={item.note} />}
              <View style={[styles.statusAvatar, { backgroundColor: item.avatarColor }]}>
                <Text style={styles.avatarLetter}>{item.name[0]}</Text>
              </View>
            </View>
            <Text style={styles.statusNameLabel} numberOfLines={1}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const ChatDetail = () => (
    <Modal visible={selectedChat !== null} animationType="slide">
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{flex: 1}}>
          <View style={styles.chatHeader}>
            <TouchableOpacity onPress={() => setSelectedChat(null)}><Ionicons name="chevron-back" size={30} color="#0084FF" /></TouchableOpacity>
            <View style={{alignItems: 'center'}}>
              <Text style={styles.chatHeaderTitle}>{selectedChat?.name}</Text>
              <Text style={{fontSize: 12, color: '#888'}}>現在開啟</Text>
            </View>
            <Ionicons name="call" size={24} color="#0084FF" />
          </View>
          <FlatList
            data={selectedChat?.messages}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ padding: 15, paddingBottom: 40 }}
            renderItem={({ item }) => (
              <View style={[styles.bubble, item.sender === 'me' ? styles.bubbleMe : styles.bubbleThem]}>
                <Text style={{ color: item.sender === 'me' ? '#fff' : '#000', fontSize: 16 }}>{item.text}</Text>
              </View>
            )}
          />
          <View style={styles.inputContainer}>
            <Ionicons name="add-circle" size={28} color="#0084FF" />
            <TextInput style={styles.textInput} placeholder="Aa" placeholderTextColor="#999" />
            <Ionicons name="send" size={26} color="#0084FF" />
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={{flex: 1}}>
        {activeTab === 'chats' ? (
          <FlatList 
            data={CHAT_DATA} 
            keyExtractor={(item) => item.id} 
            ListHeaderComponent={() => (
              <>
                <View style={styles.headerRow}>
                  <Text style={styles.mainTitle}>聊天</Text>
                  <View style={{flexDirection: 'row'}}>
                    <Ionicons name="camera" size={26} style={{marginRight: 15}} />
                    <Ionicons name="create-outline" size={26} />
                  </View>
                </View>
                {/* 搜尋欄 */}
                <View style={styles.searchBar}>
                  <Ionicons name="search" size={20} color="#888" />
                  <Text style={{color: '#888', marginLeft: 10}}>搜尋</Text>
                </View>
                {/* 橫向狀態列 */}
                <HorizontalStatusSection />
              </>
            )}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.chatItem} onPress={() => setSelectedChat(item)}>
                <View style={[styles.avatarCircle, { backgroundColor: item.avatarColor }]}>
                  <Text style={styles.avatarLetter}>{item.name[0]}</Text>
                </View>
                <View style={styles.chatTextContent}>
                  <View style={styles.chatNameRow}>
                    <Text style={styles.nameText}>{item.name}</Text>
                    <Text style={styles.lastMsgTime}>{item.time}</Text>
                  </View>
                  <Text style={styles.lastMsgText} numberOfLines={1}>{item.lastMsg}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        ) : (
          <View style={styles.profileContainer}>
            <Text style={styles.mainTitle}>個人設定</Text>
            <TouchableOpacity onPress={pickImage} style={styles.profileAvatarWrapper}>
              {profileImage ? <Image source={{ uri: profileImage }} style={styles.largeAvatar} /> : <View style={styles.largeAvatarPlaceholder}><Ionicons name="person" size={50} color="#ccc" /></View>}
              <View style={styles.cameraBadge}><Ionicons name="camera" size={18} color="white" /></View>
            </TouchableOpacity>
            <Text style={styles.profileName}>林冠益 (11256033)</Text>
          </View>
        )}
      </View>
      <ChatDetail />
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('chats')}>
          <Ionicons name="chatbubble" size={26} color={activeTab === 'chats' ? '#0084FF' : '#999'} />
          <Text style={{ color: activeTab === 'chats' ? '#0084FF' : '#999', fontSize: 12 }}>聊天</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('profile')}>
          <Ionicons name="settings" size={26} color={activeTab === 'profile' ? '#0084FF' : '#999'} />
          <Text style={{ color: activeTab === 'profile' ? '#0084FF' : '#999', fontSize: 12 }}>設定</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 10, alignItems: 'center' },
  mainTitle: { fontSize: 30, fontWeight: 'bold' },
  searchBar: { flexDirection: 'row', backgroundColor: '#F0F2F5', margin: 16, padding: 10, borderRadius: 10, alignItems: 'center' },
  
 // 1. 增加整體狀態列高度，確保氣泡有空間長大
  statusSection: { 
    height: 150, // 從 130 增加到 150
    marginBottom: 5,
    marginTop: 10,
  },
  
  statusScroll: { 
    paddingLeft: 16,
    alignItems: 'flex-end', // 讓頭像對齊底部，氣泡向上長
  },

  statusItem: { 
    width: 85, 
    alignItems: 'center', 
    marginRight: 5,
    justifyContent: 'flex-end',
    height: '100%', // 填滿 statusSection
  },

  avatarWrapper: { 
    position: 'relative', 
    width: 65, 
    height: 65, 
    justifyContent: 'center', 
    alignItems: 'center',
  },

  // 2. 優化氣泡容器，確保文字不會被吃掉
  noteContainer: { 
    position: 'absolute', 
    top: -35, // 向上位移更多，避免壓到頭像
    zIndex: 999, 
    alignItems: 'center',
    width: 100, // 給氣泡寬一點的容器空間
  },

  noteBubble: { 
    backgroundColor: '#fff', 
    paddingHorizontal: 8, 
    paddingVertical: 4, 
    borderRadius: 12, 
    minWidth: 40,
    maxWidth: 80, 
    // 增加陰影讓它在 web 更好看
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 1 }, 
    shadowOpacity: 0.2, 
    shadowRadius: 2, 
    elevation: 4, 
  },

  noteText: { 
    fontSize: 11, 
    color: '#000', 
    textAlign: 'center',
    lineHeight: 14, // 設定行高避免文字擠在一起
  },

  noteTail: { 
    width: 0, 
    height: 0, 
    borderLeftWidth: 5, 
    borderLeftColor: 'transparent', 
    borderRightWidth: 5, 
    borderRightColor: 'transparent', 
    borderTopWidth: 6, 
    borderTopColor: '#fff', 
    marginTop: -1,
  },

  statusAvatar: { 
    width: 65, 
    height: 65, 
    borderRadius: 32.5, 
    borderWidth: 3, 
    borderColor: '#F0F2F5', // 增加外圈邊框，更有層次感
    justifyContent: 'center', 
    alignItems: 'center',
    overflow: 'hidden',
  },
  
  statusNameLabel: { 
    fontSize: 12, 
    color: '#555', 
    marginTop: 5, 
    marginBottom: 5,
    textAlign: 'center' 
  },
  
  // 便利貼氣泡樣式 (參考 Messenger 風格)
  noteContainer: { position: 'absolute', top: -15, zIndex: 10, alignItems: 'center' },
  noteBubble: { backgroundColor: '#fff', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 15, 
                maxWidth: 80, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 3 },
  noteText: { fontSize: 11, color: '#000', textAlign: 'center' },
  noteTail: { width: 0, height: 0, borderLeftWidth: 5, borderLeftColor: 'transparent', borderRightWidth: 5, borderRightColor: 'transparent', borderTopWidth: 8, borderTopColor: '#fff', marginTop: -1 },
  addNoteBadge: { position: 'absolute', top: 0, left: 0, backgroundColor: '#8E8E93', width: 20, height: 20, borderRadius: 10, zIndex: 11, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#fff' },

  chatItem: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 10, alignItems: 'center' },
  avatarCircle: { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center' },
  avatarLetter: { color: 'white', fontSize: 22, fontWeight: 'bold' },
  chatTextContent: { marginLeft: 15, flex: 1, paddingBottom: 5 },
  chatNameRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  nameText: { fontSize: 17, fontWeight: '600' },
  lastMsgTime: { color: '#888', fontSize: 12 },
  lastMsgText: { color: '#888', marginTop: 2, fontSize: 14 },
  
  tabBar: { flexDirection: 'row', height: 65, borderTopWidth: 0.5, borderTopColor: '#eee', backgroundColor: '#fff' },
  tabItem: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  chatHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15, paddingVertical: 10, borderBottomWidth: 0.5, borderBottomColor: '#eee' },
  chatHeaderTitle: { fontSize: 17, fontWeight: 'bold' },
  bubble: { padding: 12, borderRadius: 20, marginVertical: 3, maxWidth: '78%' },
  bubbleMe: { backgroundColor: '#0084FF', alignSelf: 'flex-end' },
  bubbleThem: { backgroundColor: '#F0F0F0', alignSelf: 'flex-start' },
  inputContainer: { flexDirection: 'row', padding: 10, alignItems: 'center', borderTopWidth: 0.5, borderTopColor: '#eee' },
  textInput: { flex: 1, backgroundColor: '#F0F2F5', borderRadius: 20, paddingHorizontal: 15, height: 40, marginHorizontal: 10 },
  profileContainer: { flex: 1, alignItems: 'center', paddingTop: 40 },
  profileAvatarWrapper: { position: 'relative' },
  largeAvatar: { width: 120, height: 120, borderRadius: 60 },
  largeAvatarPlaceholder: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center' },
  cameraBadge: { position: 'absolute', bottom: 5, right: 5, backgroundColor: '#0084FF', padding: 6, borderRadius: 15, borderWidth: 3, borderColor: 'white' },
  profileName: { fontSize: 24, fontWeight: 'bold', marginTop: 20 },
});