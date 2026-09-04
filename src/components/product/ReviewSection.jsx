import React, { useMemo } from "react";

import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";

import useProductReviewsViewModel from "../../viewmodels/useProductReviewsViewModel";

/* =========================================================
   RYDE DESIGN SYSTEM
========================================================= */

const UI = {
  background: "#FAFAF9",
  surface: "#FFFFFF",

  ink: "#0F1B33",
  inkSoft: "#334155",
  muted: "#64748B",
  subtle: "#94A3B8",

  line: "#E7EAF0",

  blue: "#2563EB",
  blueSoft: "#EFF5FF",

  navy: "#071A3A",

  star: "#F59E0B",
};

/* =========================================================
   REVIEW SECTION
========================================================= */

export default function ReviewSection({ productId }) {
  const { reviews, loading } = useProductReviewsViewModel(productId);

  /* =======================================================
     REVIEW STATISTICS
  ======================================================= */

  const reviewStats = useMemo(() => {
    if (!Array.isArray(reviews) || reviews.length === 0) {
      return {
        average: 0,
        count: 0,
      };
    }

    const total = reviews.reduce(
      (sum, review) => sum + Number(review.rating || 0),
      0,
    );

    return {
      average: (total / reviews.length).toFixed(1),
      count: reviews.length,
    };
  }, [reviews]);

  /* =======================================================
     STARS
  ======================================================= */

  const renderStars = (rating, size = 15) => {
    const safeRating = Number(rating) || 0;

    return (
      <View style={styles.stars}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Ionicons
            key={star}
            name={star <= safeRating ? "star" : "star-outline"}
            size={size}
            color={UI.star}
          />
        ))}
      </View>
    );
  };

  /* =======================================================
     REVIEW ITEM
  ======================================================= */

  const renderReview = ({ item }) => {
    const userName = item.user?.fullName || "Người dùng";

    const avatar = item.user?.avatar || null;

    const rating = Number(item.rating) || 0;

    const date = item.createdAt
      ? new Date(item.createdAt).toLocaleDateString("vi-VN")
      : "";

    return (
      <View style={styles.reviewItem}>
        {/* AVATAR */}

        {avatar ? (
          <Image source={{ uri: avatar }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarLetter}>
              {userName.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}

        {/* CONTENT */}

        <View style={styles.reviewContent}>
          {/* USER + DATE */}

          <View style={styles.reviewTopRow}>
            <View style={styles.userBlock}>
              <Text style={styles.userName} numberOfLines={1}>
                {userName}
              </Text>

              <View style={styles.verifiedRow}>
                <Ionicons name="checkmark-circle" size={12} color={UI.blue} />

                <Text style={styles.verifiedText}>Đã mua hàng</Text>
              </View>
            </View>

            {date ? <Text style={styles.date}>{date}</Text> : null}
          </View>

          {/* RATING */}

          <View style={styles.ratingRow}>
            {renderStars(rating, 14)}

            <Text style={styles.ratingNumber}>{rating}.0</Text>
          </View>

          {/* COMMENT */}

          {item.comment ? (
            <Text style={styles.comment}>{item.comment}</Text>
          ) : (
            <Text style={styles.noComment}>
              Người dùng không để lại nhận xét.
            </Text>
          )}
        </View>
      </View>
    );
  };

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingIcon}>
          <ActivityIndicator size="small" color={UI.blue} />
        </View>

        <Text style={styles.loadingText}>Đang tải đánh giá...</Text>
      </View>
    );
  }

  /* =======================================================
     EMPTY
  ======================================================= */

  if (!Array.isArray(reviews) || reviews.length === 0) {
    return (
      <View style={styles.container}>
        {/* HEADER */}

        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>COMMUNITY</Text>

            <Text style={styles.title}>Đánh giá sản phẩm</Text>
          </View>

          <View style={styles.countBadge}>
            <Text style={styles.countBadgeText}>0</Text>
          </View>
        </View>

        {/* EMPTY */}

        <View style={styles.emptyContainer}>
          <View style={styles.emptyIcon}>
            <Ionicons name="chatbubble-outline" size={25} color={UI.blue} />
          </View>

          <Text style={styles.emptyTitle}>Chưa có đánh giá</Text>

          <Text style={styles.emptyText}>
            Hãy là người đầu tiên chia sẻ cảm nhận về sản phẩm này.
          </Text>
        </View>
      </View>
    );
  }

  /* =======================================================
     MAIN
  ======================================================= */

  return (
    <View style={styles.container}>
      {/* ===================================================
          HEADER
      =================================================== */}

      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>COMMUNITY</Text>

          <Text style={styles.title}>Đánh giá sản phẩm</Text>
        </View>

        <View style={styles.countBadge}>
          <Text style={styles.countBadgeText}>{reviewStats.count}</Text>
        </View>
      </View>

      {/* ===================================================
          RATING OVERVIEW
      =================================================== */}

      <View style={styles.ratingOverview}>
        {/* BIG RATING */}

        <View style={styles.ratingScore}>
          <Text style={styles.averageRating}>{reviewStats.average}</Text>

          <View style={styles.averageStars}>
            {renderStars(Math.round(Number(reviewStats.average)), 15)}
          </View>

          <Text style={styles.reviewCount}>{reviewStats.count} đánh giá</Text>
        </View>

        {/* DIVIDER */}

        <View style={styles.overviewDivider} />

        {/* SIMPLE MESSAGE */}

        <View style={styles.ratingMessage}>
          <View style={styles.ratingMessageIcon}>
            <Ionicons name="thumbs-up-outline" size={17} color={UI.blue} />
          </View>

          <Text style={styles.ratingMessageText}>
            Phản hồi từ cộng đồng RYDE
          </Text>
        </View>
      </View>

      {/* ===================================================
          REVIEW LIST
      =================================================== */}

      <FlatList
        data={reviews}
        keyExtractor={(item, index) => item?._id || String(index)}
        renderItem={renderReview}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.reviewList}
      />
    </View>
  );
}

/* =========================================================
   STYLES
========================================================= */

const styles = StyleSheet.create({
  /* =======================================================
     CONTAINER
  ======================================================= */

  container: {
    marginTop: 28,
  },

  /* =======================================================
     HEADER
  ======================================================= */

  header: {
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },

  eyebrow: {
    fontSize: 9,
    lineHeight: 13,
    fontWeight: "900",
    letterSpacing: 1.4,
    color: UI.blue,
  },

  title: {
    marginTop: 3,
    fontSize: 20,
    lineHeight: 26,
    fontWeight: "800",
    letterSpacing: -0.3,
    color: UI.ink,
  },

  countBadge: {
    minWidth: 38,
    height: 38,
    paddingHorizontal: 10,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: UI.blueSoft,
  },

  countBadgeText: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "800",
    color: UI.blue,
  },

  /* =======================================================
     RATING OVERVIEW
  ======================================================= */

  ratingOverview: {
    marginTop: 16,
    marginHorizontal: 20,
    minHeight: 104,
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: UI.surface,
    borderWidth: 1,
    borderColor: UI.line,
  },

  ratingScore: {
    alignItems: "flex-start",
    justifyContent: "center",
  },

  averageRating: {
    fontSize: 29,
    lineHeight: 34,
    fontWeight: "900",
    letterSpacing: -0.7,
    color: UI.ink,
  },

  averageStars: {
    marginTop: 3,
  },

  reviewCount: {
    marginTop: 4,
    fontSize: 10,
    lineHeight: 14,
    fontWeight: "600",
    color: UI.subtle,
  },

  overviewDivider: {
    width: 1,
    height: 55,
    marginHorizontal: 20,
    backgroundColor: UI.line,
  },

  ratingMessage: {
    flex: 1,
    alignItems: "flex-start",
  },

  ratingMessageIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: UI.blueSoft,
  },

  ratingMessageText: {
    marginTop: 7,
    fontSize: 11,
    lineHeight: 16,
    fontWeight: "700",
    color: UI.inkSoft,
  },

  /* =======================================================
     REVIEW LIST
  ======================================================= */

  reviewList: {
    marginTop: 6,
    paddingHorizontal: 20,
  },

  /* =======================================================
     REVIEW ITEM
  ======================================================= */

  reviewItem: {
    paddingVertical: 18,
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: UI.line,
  },

  /* =======================================================
     AVATAR
  ======================================================= */

  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
    backgroundColor: "#F1F3F5",
  },

  avatarPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: UI.blueSoft,
  },

  avatarLetter: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: "800",
    color: UI.blue,
  },

  /* =======================================================
     REVIEW CONTENT
  ======================================================= */

  reviewContent: {
    flex: 1,
    minWidth: 0,
  },

  reviewTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },

  userBlock: {
    flex: 1,
    paddingRight: 8,
  },

  userName: {
    fontSize: 14,
    lineHeight: 19,
    fontWeight: "800",
    color: UI.ink,
  },

  verifiedRow: {
    marginTop: 2,
    flexDirection: "row",
    alignItems: "center",
  },

  verifiedText: {
    marginLeft: 3,
    fontSize: 9,
    lineHeight: 13,
    fontWeight: "600",
    color: UI.blue,
  },

  date: {
    fontSize: 10,
    lineHeight: 14,
    color: UI.subtle,
  },

  /* =======================================================
     STARS
  ======================================================= */

  ratingRow: {
    marginTop: 6,
    flexDirection: "row",
    alignItems: "center",
  },

  stars: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },

  ratingNumber: {
    marginLeft: 6,
    fontSize: 10,
    lineHeight: 14,
    fontWeight: "700",
    color: UI.muted,
  },

  /* =======================================================
     COMMENT
  ======================================================= */

  comment: {
    marginTop: 8,
    fontSize: 13,
    lineHeight: 20,
    color: UI.inkSoft,
  },

  noComment: {
    marginTop: 8,
    fontSize: 12,
    lineHeight: 18,
    fontStyle: "italic",
    color: UI.subtle,
  },

  /* =======================================================
     EMPTY
  ======================================================= */

  emptyContainer: {
    marginTop: 16,
    marginHorizontal: 20,
    paddingVertical: 28,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    backgroundColor: UI.surface,
    borderWidth: 1,
    borderColor: UI.line,
  },

  emptyIcon: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: UI.blueSoft,
  },

  emptyTitle: {
    marginTop: 12,
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "800",
    color: UI.ink,
  },

  emptyText: {
    maxWidth: 270,
    marginTop: 5,
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
    color: UI.muted,
  },

  /* =======================================================
     LOADING
  ======================================================= */

  loadingContainer: {
    marginTop: 28,
    paddingVertical: 28,
    alignItems: "center",
    justifyContent: "center",
  },

  loadingIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: UI.blueSoft,
  },

  loadingText: {
    marginTop: 9,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "600",
    color: UI.muted,
  },
});
